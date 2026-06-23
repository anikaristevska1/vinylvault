package mk.ukim.finki.vinylvault.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import mk.ukim.finki.vinylvault.dto.cart.*;
import mk.ukim.finki.vinylvault.model.User;
import mk.ukim.finki.vinylvault.service.CartService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public CartResponse getMyCart(@AuthenticationPrincipal User user) {
        return cartService.getCart(user);
    }

    @PostMapping("/items")
    public CartResponse addItem(@AuthenticationPrincipal User user,
                                 @Valid @RequestBody AddToCartRequest request) {
        return cartService.addItem(user, request);
    }

    @PutMapping("/items/{recordId}")
    public CartResponse updateItem(@AuthenticationPrincipal User user,
                                    @PathVariable Long recordId,
                                    @Valid @RequestBody UpdateCartItemRequest request) {
        return cartService.updateQuantity(user, recordId, request.getQuantity());
    }

    @DeleteMapping("/items/{recordId}")
    public CartResponse removeItem(@AuthenticationPrincipal User user,
                                    @PathVariable Long recordId) {
        return cartService.removeItem(user, recordId);
    }

    @DeleteMapping
    public CartResponse clearCart(@AuthenticationPrincipal User user) {
        return cartService.clearCart(user);
    }

    @PostMapping("/merge")
    public CartResponse mergeCart(@AuthenticationPrincipal User user,
                                   @Valid @RequestBody MergeCartRequest request) {
        return cartService.mergeCart(user, request);
    }
}
