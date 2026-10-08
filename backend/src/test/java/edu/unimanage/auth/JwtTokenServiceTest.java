package edu.unimanage.auth;

import static org.assertj.core.api.Assertions.assertThat;

import edu.unimanage.user.UserAccount;
import edu.unimanage.user.UserRole;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import javax.crypto.spec.SecretKeySpec;
import org.junit.jupiter.api.Test;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;

class JwtTokenServiceTest {
    @Test
    void issueShouldIncludeStandardClaimsAndRole() {
        var secret = new SecretKeySpec("12345678901234567890123456789012".getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        JwtEncoder encoder = NimbusJwtEncoder.withSecretKey(secret).algorithm(MacAlgorithm.HS256).build();
        var service = new JwtTokenService(encoder, "unimanage-test", Duration.ofMinutes(30));

        var user = new UserAccount("student@example.edu", "encodedPassword", "Ada Student", UserRole.STUDENT);
        var response = service.issue(user);

        assertThat(response.accessToken()).isNotBlank();
        assertThat(response.user().email()).isEqualTo("student@example.edu");
        assertThat(response.user().role()).isEqualTo(UserRole.STUDENT);
    }
}
