package mk.ukim.finki.vinylvault.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import mk.ukim.finki.vinylvault.dto.VinylRecordRequest;
import mk.ukim.finki.vinylvault.dto.VinylRecordResponse;
import mk.ukim.finki.vinylvault.service.VinylRecordService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/records")
@RequiredArgsConstructor
public class VinylRecordController {

    private final VinylRecordService service;

    @GetMapping
    public List<VinylRecordResponse> getAll(
            @RequestParam(required = false) String genre,
            @RequestParam(required = false) String search) {
        if (search != null && !search.isBlank()) {
            return service.searchByAlbumOrArtist(search);
        }
        if (genre != null && !genre.isBlank()) {
            return service.findByGenre(genre);
        }
        return service.findAll();
    }

    @GetMapping("/{id}")
    public VinylRecordResponse getById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public VinylRecordResponse create(@Valid @RequestBody VinylRecordRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public VinylRecordResponse update(@PathVariable Long id,
                                       @Valid @RequestBody VinylRecordRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/genres")
    public List<String> getAllGenres() {
        return service.findAllGenres();
    }

    @GetMapping("/artists")
    public List<String> getAllArtists() {
        return service.findAllArtists();
    }
}
