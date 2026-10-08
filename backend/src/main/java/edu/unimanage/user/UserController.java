package edu.unimanage.user;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Size;
import java.util.Map;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api")
public class UserController {
    private final UserAccountRepository users;
    private final StudentProfileRepository students;
    private final TeacherProfileRepository teachers;

    public UserController(UserAccountRepository users, StudentProfileRepository students, TeacherProfileRepository teachers) {
        this.users = users;
        this.students = students;
        this.teachers = teachers;
    }

    @GetMapping("/users/me")
    @PreAuthorize("isAuthenticated()")
    public UserProfileResponse me(@AuthenticationPrincipal Jwt principal) {
        UUID userId = UUID.fromString(principal.getClaimAsString("userId"));
        UserAccount user = users.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        return switch (user.getRole()) {
            case STUDENT -> {
                StudentProfile profile = students.findByUserId(userId)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student profile not found"));
                yield new UserProfileResponse(user.getId(), user.getEmail(), user.getFullName(), user.getRole(),
                        profile.getStudentNumber(), profile.getGroupName(), null, null, profile.getPhone());
            }
            case TEACHER -> {
                TeacherProfile profile = teachers.findByUserId(userId)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Teacher profile not found"));
                yield new UserProfileResponse(user.getId(), user.getEmail(), user.getFullName(), user.getRole(),
                        null, null, profile.getStaffNumber(), profile.getDepartment(), null);
            }
            case ADMIN -> new UserProfileResponse(user.getId(), user.getEmail(), user.getFullName(), user.getRole(),
                    null, null, null, null, null);
        };
    }

    @PutMapping("/users/me")
    @PreAuthorize("isAuthenticated()")
    @Transactional
    public UserProfileResponse updateMe(@AuthenticationPrincipal Jwt principal, @Valid @RequestBody UpdateUserProfileRequest request) {
        UUID userId = UUID.fromString(principal.getClaimAsString("userId"));
        UserAccount user = users.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (request.fullName() != null && !request.fullName().isBlank()) {
            user.setFullName(request.fullName());
        }

        if (request.phone() != null && !request.phone().isBlank()) {
            if (user.getRole() == UserRole.STUDENT) {
                StudentProfile profile = students.findByUserId(userId)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student profile not found"));
                profile.setPhone(request.phone());
            }
        }

        if (request.department() != null && !request.department().isBlank()) {
            if (user.getRole() == UserRole.TEACHER) {
                TeacherProfile profile = teachers.findByUserId(userId)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Teacher profile not found"));
                profile.setDepartment(request.department());
            }
        }

        return me(principal);
    }

    public record UpdateUserProfileRequest(
            @Size(max = 160) String fullName,
            @Size(max = 40) String phone,
            @Size(max = 120) String department) {}

    public record UserProfileResponse(
            UUID id,
            String email,
            String fullName,
            UserRole role,
            String studentNumber,
            String groupName,
            String staffNumber,
            String department,
            String phone) {}
}
