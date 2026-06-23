package mk.ukim.finki.vinylvault.repository;

import mk.ukim.finki.vinylvault.model.VinylRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VinylRecordRepository extends JpaRepository<VinylRecord, Long> {

    List<VinylRecord> findByGenreIgnoreCase(String genre);

    List<VinylRecord> findByArtistContainingIgnoreCase(String artist);

    @Query("SELECT v FROM VinylRecord v WHERE " +
            "LOWER(v.albumTitle) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(v.artist) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<VinylRecord> searchByAlbumOrArtist(String search);

    @Query("SELECT DISTINCT v.genre FROM VinylRecord v ORDER BY v.genre")
    List<String> findAllDistinctGenres();

    @Query("SELECT DISTINCT v.artist FROM VinylRecord v ORDER BY v.artist")
    List<String> findAllDistinctArtists();
}
