package mk.ukim.finki.vinylvault.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mk.ukim.finki.vinylvault.model.*;
import mk.ukim.finki.vinylvault.repository.UserRepository;
import mk.ukim.finki.vinylvault.repository.VinylRecordRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashSet;
import java.util.List;
import java.util.Random;
import java.util.Set;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private static final int TARGET_RECORD_COUNT = 100;

    private final VinylRecordRepository recordRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final Random random = new Random();

    /**
     * Genre-based queries for variety. Each returns up to `limit` results
     * from iTunes Search API. Total target: ~100-130 unique albums.
     */
    private static final List<SeedQuery> SEED_QUERIES = List.of(
            new SeedQuery("classic rock", 25),
            new SeedQuery("pop", 20),
            new SeedQuery("hip hop", 20),
            new SeedQuery("indie rock", 20),
            new SeedQuery("electronic", 15),
            new SeedQuery("jazz", 12),
            new SeedQuery("soul", 12),
            new SeedQuery("alternative rock", 15),
            new SeedQuery("punk", 10),
            new SeedQuery("rnb", 12)
    );

    private record SeedQuery(String term, int limit) {}

    @Override
    public void run(String... args) {
        seedUsers();
        seedRecords();
    }

    private void seedUsers() {
        if (userRepository.count() > 0) {
            log.info("Users already exist, skipping user seed");
            return;
        }

        log.info("Seeding default users...");

        User admin = User.builder()
                .email("admin@vinylvault.local")
                .password(passwordEncoder.encode("admin123"))
                .firstName("Admin")
                .lastName("User")
                .role(Role.ADMIN)
                .build();
        userRepository.save(admin);

        User user = User.builder()
                .email("user@vinylvault.local")
                .password(passwordEncoder.encode("user123"))
                .firstName("Test")
                .lastName("User")
                .role(Role.USER)
                .build();
        userRepository.save(user);

        log.info("Seeded admin@vinylvault.local / admin123 and user@vinylvault.local / user123");
    }

    private void seedRecords() {
        long existing = recordRepository.count();
        if (existing >= TARGET_RECORD_COUNT) {
            log.info("Already have {} records (target {}), skipping seed",
                    existing, TARGET_RECORD_COUNT);
            return;
        }

        log.info("Seeding records from iTunes Search API (target: {})...", TARGET_RECORD_COUNT);

        // Load existing keys for dedup
        Set<String> seenKeys = recordRepository.findAll().stream()
                .map(r -> dedupKey(r.getArtist(), r.getAlbumTitle()))
                .collect(Collectors.toCollection(HashSet::new));

        int created = 0;
        long currentCount = existing;

        outer:
        for (SeedQuery query : SEED_QUERIES) {
            try {
                List<JsonNode> results = fetchAlbumsForQuery(query.term(), query.limit());
                log.info("Query '{}': {} results from iTunes", query.term(), results.size());

                for (JsonNode item : results) {
                    if (currentCount >= TARGET_RECORD_COUNT) break outer;

                    String album = textOrNull(item, "collectionName");
                    String artist = textOrNull(item, "artistName");
                    if (album == null || artist == null) continue;

                    String key = dedupKey(artist, album);
                    if (seenKeys.contains(key)) continue;
                    seenKeys.add(key);

                    String genre = textOrNull(item, "primaryGenreName");
                    String artworkUrl = textOrNull(item, "artworkUrl100");
                    if (artworkUrl != null) {
                        artworkUrl = artworkUrl.replace("100x100", "600x600");
                    }

                    Integer year = parseYear(textOrNull(item, "releaseDate"));

                    VinylRecord record = VinylRecord.builder()
                            .albumTitle(album)
                            .artist(artist)
                            .genre(genre != null ? genre : "Other")
                            .releaseYear(year)
                            .condition(randomCondition())
                            .size(randomSize())
                            .price(randomPrice())
                            .stockQuantity(ThreadLocalRandom.current().nextInt(1, 15))
                            .coverImageUrl(artworkUrl)
                            .build();

                    recordRepository.save(record);
                    created++;
                    currentCount++;
                }
            } catch (Exception e) {
                log.warn("Failed for query '{}': {}", query.term(), e.getMessage());
            }
        }

        log.info("Record seed complete. Created {} new records (total now: {}).",
                created, currentCount);
    }

    private List<JsonNode> fetchAlbumsForQuery(String term, int limit) throws Exception {
        String encoded = URLEncoder.encode(term, StandardCharsets.UTF_8);
        String url = "https://itunes.apple.com/search?term=" + encoded
                + "&entity=album&limit=" + limit;

        String response = restTemplate.getForObject(url, String.class);
        JsonNode root = objectMapper.readTree(response);
        JsonNode results = root.get("results");

        if (results == null || !results.isArray()) {
            return List.of();
        }

        return java.util.stream.StreamSupport
                .stream(results.spliterator(), false)
                .toList();
    }

    private String textOrNull(JsonNode node, String field) {
        JsonNode v = node.get(field);
        return v != null && !v.isNull() ? v.asText() : null;
    }

    private Integer parseYear(String releaseDate) {
        if (releaseDate == null || releaseDate.length() < 4) return null;
        try {
            return Integer.parseInt(releaseDate.substring(0, 4));
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private String dedupKey(String artist, String album) {
        return (artist + "::" + album).toLowerCase();
    }

    private Condition randomCondition() {
        Condition[] options = {Condition.MINT, Condition.NEAR_MINT,
                Condition.VERY_GOOD, Condition.GOOD};
        return options[random.nextInt(options.length)];
    }

    /**
     * Realistic distribution: ~70% 12" LPs, ~20% 7" singles, ~10% 10" EPs
     */
    private Size randomSize() {
        int r = random.nextInt(10);
        if (r < 7) return Size.TWELVE_INCH;
        if (r < 9) return Size.SEVEN_INCH;
        return Size.TEN_INCH;
    }

    private BigDecimal randomPrice() {
        double price = 19.99 + random.nextDouble() * 30;
        return BigDecimal.valueOf(Math.round(price * 100.0) / 100.0);
    }
}
