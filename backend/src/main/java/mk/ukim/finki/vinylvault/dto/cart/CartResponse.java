package mk.ukim.finki.vinylvault.dto.cart;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import mk.ukim.finki.vinylvault.model.Cart;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartResponse {
    private List<CartItemResponse> items;
    private Integer itemCount;
    private BigDecimal subtotal;

    public static CartResponse from(Cart cart) {
        List<CartItemResponse> items = cart.getItems().stream()
                .map(CartItemResponse::from)
                .toList();

        int count = items.stream().mapToInt(CartItemResponse::getQuantity).sum();
        BigDecimal subtotal = items.stream()
                .map(i -> i.getPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return CartResponse.builder()
                .items(items)
                .itemCount(count)
                .subtotal(subtotal)
                .build();
    }
}
