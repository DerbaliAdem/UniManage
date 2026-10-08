package edu.unimanage.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateUserRequest(
        @NotBlank @Email String email,
        @NotBlank @Size(min = 12, max = 100) String password,
        @NotBlank @Size(max = 160) String fullName,
        @NotNull UserRole role,
        @Size(max = 40) String studentNumber,
        @Size(max = 80) String groupName,
        @Size(max = 40) String staffNumber,
        @Size(max = 120) String department) {}
