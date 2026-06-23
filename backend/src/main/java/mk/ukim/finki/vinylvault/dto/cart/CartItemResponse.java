package mk.ukim.finki.vinylvault.dto.cart;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import mk.ukim.finki.vinylvault.model.CartItem;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItemResponse {

    /** ID na zapisot (recordId), ne ID na cartItem. Frontend-ot raboti so recordId. */
    private Long id;
    private Long recordId;
    private String albumTitle;
    private String artist;
    private BigDecimal price;
    private String coverImagePath;
    private String coverImageUrl;
    private Integer quantity;
    private Integer stockQuantity;

    public static CartItemResponse from(CartItem item) {
        var record = item.getRecord();
        return CartItemResponse.builder()
                .id(record.getId())
                .recordId(record.getId())
                .albumTitle(record.getAlbumTitle())
                .artist(record.getArtist())
                .price(record.getPrice())
                .coverImagePath(record.getCoverImagePath())
                .coverImageUrl(record.getCoverImageUrl())
                .quantity(item.getQuantity())
                .stockQuantity(record.getStockQuantity())
                .build();
    }
}
