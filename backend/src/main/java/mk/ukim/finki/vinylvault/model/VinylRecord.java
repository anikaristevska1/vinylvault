package mk.ukim.finki.vinylvault.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "vinyl_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VinylRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String albumTitle;

    @Column(nullable = false)
    private String artist;

    @Column(nullable = false)
    private String genre;

    @Column(name = "release_year")
    private Integer releaseYear;

    @Enumerated(EnumType.STRING)
    @Column(name = "record_condition", nullable = false)
    private Condition condition;

    @Enumerated(EnumType.STRING)
    private Size size;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "stock_quantity", nullable = false)
    private Integer stockQuantity;

    @Column(name = "acquired_date")
    private LocalDate acquiredDate;

    @Column(columnDefinition = "TEXT")
    private String notes;

    /**
     * Pateka do uploaded cover slika (relativna URL, pr. cover-123.jpg).
     * Se servira preku /api/images/{fileName}.
     */
    @Column(name = "cover_image_path")
    private String coverImagePath;

    /**
     * Nadvoresna URL do cover slika (pr. od iTunes CDN).
     * Se koristi koga slikata ne e uploaded lokalno.
     */
    @Column(name = "cover_image_url", length = 1024)
    private String coverImageUrl;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
