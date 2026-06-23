package mk.ukim.finki.vinylvault.service;

import lombok.RequiredArgsConstructor;
import mk.ukim.finki.vinylvault.dto.cart.AddToCartRequest;
import mk.ukim.finki.vinylvault.dto.cart.CartResponse;
import mk.ukim.finki.vinylvault.dto.cart.MergeCartRequest;
import mk.ukim.finki.vinylvault.exception.RecordNotFoundException;
import mk.ukim.finki.vinylvault.model.Cart;
import mk.ukim.finki.vinylvault.model.CartItem;
import mk.ukim.finki.vinylvault.model.User;
import mk.ukim.finki.vinylvault.model.VinylRecord;
import mk.ukim.finki.vinylvault.repository.CartItemRepository;
import mk.ukim.finki.vinylvault.repository.CartRepository;
import mk.ukim.finki.vinylvault.repository.VinylRecordRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final VinylRecordRepository recordRepository;

    public CartResponse getCart(User user) {
        Cart cart = getOrCreateCart(user);
        return CartResponse.from(cart);
    }

    public CartResponse addItem(User user, AddToCartRequest request) {
        Cart cart = getOrCreateCart(user);
        VinylRecord record = recordRepository.findById(request.getRecordId())
                .orElseThrow(() -> new RecordNotFoundException(request.getRecordId()));

        int qtyToAdd = request.getQuantity() != null ? request.getQuantity() : 1;

        CartItem item = cartItemRepository
                .findByCartIdAndRecordId(cart.getId(), record.getId())
                .orElseGet(() -> {
                    CartItem newItem = CartItem.builder()
                            .cart(cart)
                            .record(record)
                            .quantity(0)
                            .build();
                    cart.getItems().add(newItem);
                    return newItem;
                });

        item.setQuantity(item.getQuantity() + qtyToAdd);
        cartItemRepository.save(item);

        return CartResponse.from(cartRepository.findById(cart.getId()).orElseThrow());
    }

    public CartResponse updateQuantity(User user, Long recordId, int quantity) {
        Cart cart = getOrCreateCart(user);
        CartItem item = cartItemRepository
                .findByCartIdAndRecordId(cart.getId(), recordId)
                .orElseThrow(() -> new IllegalArgumentException("Item not in cart"));

        if (quantity <= 0) {
            cart.getItems().remove(item);
            cartItemRepository.delete(item);
        } else {
            item.setQuantity(quantity);
            cartItemRepository.save(item);
        }

        return CartResponse.from(cartRepository.findById(cart.getId()).orElseThrow());
    }

    public CartResponse removeItem(User user, Long recordId) {
        Cart cart = getOrCreateCart(user);
        cartItemRepository.findByCartIdAndRecordId(cart.getId(), recordId)
                .ifPresent(item -> {
                    cart.getItems().remove(item);
                    cartItemRepository.delete(item);
                });
        return CartResponse.from(cartRepository.findById(cart.getId()).orElseThrow());
    }

    public CartResponse clearCart(User user) {
        Cart cart = getOrCreateCart(user);
        cart.getItems().clear();
        cartRepository.save(cart);
        return CartResponse.from(cart);
    }

    /**
     * Spojuva guest cart (od localStorage) so server cart-ot pri login.
     * Postoeckite kolichini se zachuvuvaat, novite se dodavaat.
     */
    public CartResponse mergeCart(User user, MergeCartRequest request) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            return getCart(user);
        }
        for (AddToCartRequest item : request.getItems()) {
            try {
                addItem(user, item);
            } catch (Exception e) {
                // Skip invalid items (e.g. record was deleted)
            }
        }
        return getCart(user);
    }

    private Cart getOrCreateCart(User user) {
        return cartRepository.findByUserId(user.getId())
                .orElseGet(() -> cartRepository.save(
                        Cart.builder().user(user).build()
                ));
    }
}
