package mk.ukim.finki.vinylvault.dto.cart;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddToCartRequest {

    @NotNull
    private Long recordId;

    @Min(1)
    private Integer quantity = 1;
}
