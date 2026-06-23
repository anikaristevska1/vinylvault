package mk.ukim.finki.vinylvault.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import mk.ukim.finki.vinylvault.model.Condition;
import mk.ukim.finki.vinylvault.model.Size;
import mk.ukim.finki.vinylvault.model.VinylRecord;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VinylRecordResponse {

    private Long id;
    private String albumTitle;
    private String artist;
    private String genre;
    private Integer releaseYear;
    private Condition condition;
    private Size size;
    private BigDecimal price;
    private Integer stockQuantity;
    private LocalDate acquiredDate;
    private String notes;
    private String coverImagePath;
    private String coverImageUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static VinylRecordResponse from(VinylRecord record) {
        return VinylRecordResponse.builder()
                .id(record.getId())
                .albumTitle(record.getAlbumTitle())
                .artist(record.getArtist())
                .genre(record.getGenre())
                .releaseYear(record.getReleaseYear())
                .condition(record.getCondition())
                .size(record.getSize())
                .price(record.getPrice())
                .stockQuantity(record.getStockQuantity())
                .acquiredDate(record.getAcquiredDate())
                .notes(record.getNotes())
                .coverImagePath(record.getCoverImagePath())
                .coverImageUrl(record.getCoverImageUrl())
                .createdAt(record.getCreatedAt())
                .updatedAt(record.getUpdatedAt())
                .build();
    }
}
