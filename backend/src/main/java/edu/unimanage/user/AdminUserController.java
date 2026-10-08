package edu.unimanage.user;

import jakarta.validation.Valid;
import java.net.URI;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {
    private final UserAccountRepository users;
    private final StudentProfileRepository students;
    private final TeacherProfileRepository teachers;
    private final PasswordEncoder passwordEncoder;

    public AdminUserController(UserAccountRepository users, StudentProfileRepository students,
            TeacherProfileRepository teachers, PasswordEncoder passwordEncoder) {
        this.users = users;
        this.students = students;
        this.teachers = teachers;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping
    @Transactional
    public ResponseEntity<UserCreatedResponse> create(@Valid @RequestBody CreateUserRequest request) {
        if (users.existsByEmailIgnoreCase(request.email())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "An account already uses this email");
        }
        if (request.role() == UserRole.STUDENT
                && (blank(request.studentNumber()) || blank(request.groupName()))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Student accounts require a student number and group");
        }
        if (request.role() == UserRole.TEACHER
                && (blank(request.staffNumber()) || blank(request.department()))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Teacher accounts require a staff number and department");
        }
        if (request.role() == UserRole.STUDENT && students.existsByStudentNumberIgnoreCase(request.studentNumber())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "A student already uses this student number");
        }
        if (request.role() == UserRole.TEACHER && teachers.existsByStaffNumberIgnoreCase(request.staffNumber())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "A teacher already uses this staff number");
        }

        UserAccount user = users.save(new UserAccount(request.email(), passwordEncoder.encode(request.password()), request.fullName(), request.role()));
        if (request.role() == UserRole.STUDENT) {
            students.save(new StudentProfile(user, request.studentNumber(), request.groupName()));
        } else if (request.role() == UserRole.TEACHER) {
            teachers.save(new TeacherProfile(user, request.staffNumber(), request.department()));
        }
        return ResponseEntity.created(URI.create("/api/admin/users/" + user.getId()))
                .body(new UserCreatedResponse(user.getId(), user.getEmail(), user.getFullName(), user.getRole()));
    }

    private boolean blank(String value) {
        return value == null || value.isBlank();
    }

    public record UserCreatedResponse(java.util.UUID id, String email, String fullName, UserRole role) {}
}
