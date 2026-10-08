package edu.unimanage.auth;

import edu.unimanage.user.UserRole;
import java.time.Instant;

public record LoginResponse(
        String accessToken,
        String tokenType,
        Instant expiresAt,
        UserSummary user) {
    public record UserSummary(String id, String email, String fullName, UserRole role) {}
}
