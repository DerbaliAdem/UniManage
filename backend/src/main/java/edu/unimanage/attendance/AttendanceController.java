package edu.unimanage.attendance;

import edu.unimanage.attendance.AttendanceDto.AttendanceItem;
import edu.unimanage.attendance.AttendanceDto.StudentSummary;
import edu.unimanage.attendance.AttendanceDto.SubmitAttendanceRequest;
import java.util.List;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {
    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @GetMapping("/session/{sessionId}")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public List<AttendanceItem> attendanceForSession(@PathVariable UUID sessionId,
            @AuthenticationPrincipal Jwt principal) {
        return attendanceService.getAttendanceForSession(sessionId, principal);
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('STUDENT', 'TEACHER', 'ADMIN')")
    public List<AttendanceItem> attendanceForStudent(@PathVariable UUID studentId,
            @AuthenticationPrincipal Jwt principal) {
        return attendanceService.getAttendanceForStudent(studentId, principal);
    }

    @GetMapping("/students/me")
    @PreAuthorize("hasRole('STUDENT')")
    public StudentSummary mySummary(@AuthenticationPrincipal Jwt principal) {
        UUID studentId = UUID.fromString(principal.getClaimAsString("userId"));
        return attendanceService.getStudentSummary(studentId);
    }

    @PostMapping("/session/{sessionId}")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<List<AttendanceItem>> submitAttendance(@PathVariable UUID sessionId,
            @RequestBody SubmitAttendanceRequest request,
            @AuthenticationPrincipal Jwt principal) {
        return ResponseEntity.ok(attendanceService.submitAttendance(sessionId, request, principal));
    }

    @PutMapping("/{attendanceId}")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public AttendanceItem updateAttendance(@PathVariable UUID attendanceId,
            @RequestBody AttendanceStatus status,
            @AuthenticationPrincipal Jwt principal) {
        return attendanceService.updateAttendance(attendanceId, status, principal);
    }
}
