package mk.ukim.finki.vinylvault.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfileRequest {

    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    private String addressLine;
    private String city;
    private String postalCode;
    private String country;
}
