package mk.ukim.finki.vinylvault.service;

import lombok.RequiredArgsConstructor;
import mk.ukim.finki.vinylvault.dto.UserResponse;
import mk.ukim.finki.vinylvault.dto.auth.AuthResponse;
import mk.ukim.finki.vinylvault.dto.auth.LoginRequest;
import mk.ukim.finki.vinylvault.dto.auth.RegisterRequest;
import mk.ukim.finki.vinylvault.model.Role;
import mk.ukim.finki.vinylvault.model.User;
import mk.ukim.finki.vinylvault.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .role(Role.USER)
                .build();

        User saved = userRepository.save(user);
        String token = jwtService.generateToken(saved);

        return AuthResponse.builder()
                .token(token)
                .user(UserResponse.from(saved))
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        String token = jwtService.generateToken(user);

        return AuthResponse.builder()
                .token(token)
                .user(UserResponse.from(user))
                .build();
    }
}
