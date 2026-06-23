package mk.ukim.finki.vinylvault.service;

import lombok.RequiredArgsConstructor;
import mk.ukim.finki.vinylvault.dto.VinylRecordRequest;
import mk.ukim.finki.vinylvault.dto.VinylRecordResponse;
import mk.ukim.finki.vinylvault.exception.RecordNotFoundException;
import mk.ukim.finki.vinylvault.model.VinylRecord;
import mk.ukim.finki.vinylvault.repository.VinylRecordRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class VinylRecordService {

    private final VinylRecordRepository repository;

    public List<VinylRecordResponse> findAll() {
        return repository.findAll().stream()
                .map(VinylRecordResponse::from)
                .toList();
    }

    public VinylRecordResponse findById(Long id) {
        VinylRecord record = repository.findById(id)
                .orElseThrow(() -> new RecordNotFoundException(id));
        return VinylRecordResponse.from(record);
    }

    public VinylRecordResponse create(VinylRecordRequest request) {
        VinylRecord record = VinylRecord.builder()
                .albumTitle(request.getAlbumTitle())
                .artist(request.getArtist())
                .genre(request.getGenre())
                .releaseYear(request.getReleaseYear())
                .condition(request.getCondition())
                .size(request.getSize())
                .price(request.getPrice())
                .stockQuantity(request.getStockQuantity())
                .acquiredDate(request.getAcquiredDate())
                .notes(request.getNotes())
                .coverImageUrl(request.getCoverImageUrl())
                .build();
        return VinylRecordResponse.from(repository.save(record));
    }

    public VinylRecordResponse update(Long id, VinylRecordRequest request) {
        VinylRecord record = repository.findById(id)
                .orElseThrow(() -> new RecordNotFoundException(id));

        record.setAlbumTitle(request.getAlbumTitle());
        record.setArtist(request.getArtist());
        record.setGenre(request.getGenre());
        record.setReleaseYear(request.getReleaseYear());
        record.setCondition(request.getCondition());
        record.setSize(request.getSize());
        record.setPrice(request.getPrice());
        record.setStockQuantity(request.getStockQuantity());
        record.setAcquiredDate(request.getAcquiredDate());
        record.setNotes(request.getNotes());
        record.setCoverImageUrl(request.getCoverImageUrl());

        return VinylRecordResponse.from(repository.save(record));
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new RecordNotFoundException(id);
        }
        repository.deleteById(id);
    }

    public List<VinylRecordResponse> findByGenre(String genre) {
        return repository.findByGenreIgnoreCase(genre).stream()
                .map(VinylRecordResponse::from)
                .toList();
    }

    public List<VinylRecordResponse> searchByAlbumOrArtist(String query) {
        return repository.searchByAlbumOrArtist(query).stream()
                .map(VinylRecordResponse::from)
                .toList();
    }

    public List<String> findAllGenres() {
        return repository.findAllDistinctGenres();
    }

    public List<String> findAllArtists() {
        return repository.findAllDistinctArtists();
    }

    public void updateCoverImagePath(Long id, String path) {
        VinylRecord record = repository.findById(id)
                .orElseThrow(() -> new RecordNotFoundException(id));
        record.setCoverImagePath(path);
        repository.save(record);
    }

    public String getCoverImagePath(Long id) {
        VinylRecord record = repository.findById(id)
                .orElseThrow(() -> new RecordNotFoundException(id));
        return record.getCoverImagePath();
    }

    public long count() {
        return repository.count();
    }
}
