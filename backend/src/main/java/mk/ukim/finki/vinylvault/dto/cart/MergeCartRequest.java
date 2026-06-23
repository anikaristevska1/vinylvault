package mk.ukim.finki.vinylvault.dto.cart;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MergeCartRequest {

    @NotNull
    @Valid
    private List<AddToCartRequest> items;
}
