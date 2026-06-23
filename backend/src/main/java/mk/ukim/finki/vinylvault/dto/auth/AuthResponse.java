package mk.ukim.finki.vinylvault.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import mk.ukim.finki.vinylvault.dto.UserResponse;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
    private String token;
    private UserResponse user;
}
