package mk.ukim.finki.vinylvault.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import mk.ukim.finki.vinylvault.model.Role;
import mk.ukim.finki.vinylvault.model.User;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private Role role;
    private String addressLine;
    private String city;
    private String postalCode;
    private String country;
    private LocalDateTime createdAt;

    public static UserResponse from(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole())
                .addressLine(user.getAddressLine())
                .city(user.getCity())
                .postalCode(user.getPostalCode())
                .country(user.getCountry())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
