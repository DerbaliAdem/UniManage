package edu.unimanage.schedule;

import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api")
public class ScheduleController {
    private final ScheduleService scheduleService;

    public ScheduleController(ScheduleService scheduleService) {
        this.scheduleService = scheduleService;
    }

    @GetMapping("/students/me/schedule")
    @PreAuthorize("hasRole('STUDENT')")
    public List<ScheduleResponse> myStudentSchedule(@AuthenticationPrincipal Jwt principal) {
        return scheduleService.listFor(principal);
    }

    @GetMapping("/teachers/me/schedule")
    @PreAuthorize("hasRole('TEACHER')")
    public List<ScheduleResponse> myTeacherSchedule(@AuthenticationPrincipal Jwt principal) {
        return scheduleService.listFor(principal);
    }

    @GetMapping("/teachers/{teacherId}/schedule")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public List<ScheduleResponse> teacherSchedule(@PathVariable UUID teacherId, @AuthenticationPrincipal Jwt principal) {
        if (principal != null && principal.getClaimAsStringList("roles") != null
                && principal.getClaimAsStringList("roles").contains("ROLE_TEACHER")
                && !UUID.fromString(principal.getClaimAsString("userId")).equals(teacherId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only view your own teaching schedule");
        }
        return scheduleService.listByTeacher(teacherId);
    }

    @GetMapping("/teachers/me/roster")
    @PreAuthorize("hasRole('TEACHER')")
    public List<ScheduleService.TeacherRosterStudent> myRoster(@AuthenticationPrincipal Jwt principal) {
        UUID teacherId = UUID.fromString(principal.getClaimAsString("userId"));
        return scheduleService.listTeacherRoster(teacherId);
    }

    @GetMapping("/classes/{sessionId}/students")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public List<ScheduleService.ClassStudentSummary> studentsForSession(@PathVariable UUID sessionId, @AuthenticationPrincipal Jwt principal) {
        return scheduleService.listStudentsForSession(sessionId, principal);
    }

    @PostMapping("/admin/classes")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ScheduleResponse> createClass(@Valid @RequestBody CreateClassSessionRequest request) {
        ScheduleResponse response = scheduleService.create(request);
        return ResponseEntity.created(URI.create("/api/classes/" + response.id())).body(response);
    }

    @DeleteMapping("/admin/classes/{classId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteClass(@PathVariable UUID classId) {
        scheduleService.delete(classId);
        return ResponseEntity.noContent().build();
    }
}
