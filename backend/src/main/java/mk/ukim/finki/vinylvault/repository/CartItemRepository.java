package mk.ukim.finki.vinylvault.repository;

import mk.ukim.finki.vinylvault.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    Optional<CartItem> findByCartIdAndRecordId(Long cartId, Long recordId);
}
