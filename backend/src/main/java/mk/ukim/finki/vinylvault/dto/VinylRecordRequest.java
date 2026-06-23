package mk.ukim.finki.vinylvault.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import mk.ukim.finki.vinylvault.model.Condition;
import mk.ukim.finki.vinylvault.model.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VinylRecordRequest {

    @NotBlank(message = "Album title is required")
    private String albumTitle;

    @NotBlank(message = "Artist is required")
    private String artist;

    @NotBlank(message = "Genre is required")
    private String genre;

    @Min(value = 1900, message = "Release year must be at least 1900")
    private Integer releaseYear;

    @NotNull(message = "Condition is required")
    private Condition condition;

    private Size size;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be positive")
    private BigDecimal price;

    @NotNull(message = "Stock quantity is required")
    @Min(value = 0, message = "Stock cannot be negative")
    private Integer stockQuantity;

    private LocalDate acquiredDate;

    private String notes;

    private String coverImageUrl;
}
