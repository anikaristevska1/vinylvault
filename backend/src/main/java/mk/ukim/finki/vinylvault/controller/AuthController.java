package mk.ukim.finki.vinylvault.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import mk.ukim.finki.vinylvault.dto.auth.AuthResponse;
import mk.ukim.finki.vinylvault.dto.auth.LoginRequest;
import mk.ukim.finki.vinylvault.dto.auth.RegisterRequest;
import mk.ukim.finki.vinylvault.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, String>> handleBadCredentials() {
        return ResponseEntity.status(401)
                .body(Map.of("message", "Invalid email or password"));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleBadRequest(IllegalArgumentException ex) {
        return ResponseEntity.status(400).body(Map.of("message", ex.getMessage()));
    }
}
