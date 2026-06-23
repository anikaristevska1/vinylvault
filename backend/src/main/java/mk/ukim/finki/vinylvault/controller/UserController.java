package mk.ukim.finki.vinylvault.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import mk.ukim.finki.vinylvault.dto.UpdateProfileRequest;
import mk.ukim.finki.vinylvault.dto.UserResponse;
import mk.ukim.finki.vinylvault.model.User;
import mk.ukim.finki.vinylvault.repository.UserRepository;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/me")
    public UserResponse me(@AuthenticationPrincipal User user) {
        return UserResponse.from(user);
    }

    @PutMapping("/me")
    public UserResponse updateMe(@AuthenticationPrincipal User user,
                                  @Valid @RequestBody UpdateProfileRequest request) {
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setAddressLine(request.getAddressLine());
        user.setCity(request.getCity());
        user.setPostalCode(request.getPostalCode());
        user.setCountry(request.getCountry());
        return UserResponse.from(userRepository.save(user));
    }
}
