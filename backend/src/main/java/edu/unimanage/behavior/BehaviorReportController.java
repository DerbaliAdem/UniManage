package edu.unimanage.behavior;

import edu.unimanage.schedule.ClassSession;
import edu.unimanage.schedule.ClassSessionRepository;
import edu.unimanage.user.StudentProfile;
import edu.unimanage.user.StudentProfileRepository;
import edu.unimanage.user.TeacherProfile;
import edu.unimanage.user.TeacherProfileRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api")
public class BehaviorReportController {
    private final BehaviorReportRepository reports;
    private final TeacherProfileRepository teachers;
    private final StudentProfileRepository students;
    private final ClassSessionRepository sessions;

    public BehaviorReportController(BehaviorReportRepository reports,
            TeacherProfileRepository teachers,
            StudentProfileRepository students,
            ClassSessionRepository sessions) {
        this.reports = reports;
        this.teachers = teachers;
        this.students = students;
        this.sessions = sessions;
    }

    @GetMapping("/behavior-reports/my")
    @PreAuthorize("hasRole('TEACHER')")
    @Transactional(readOnly = true)
    public List<ReportResponse> myReports(@AuthenticationPrincipal Jwt principal) {
        UUID teacherId = UUID.fromString(principal.getClaimAsString("userId"));
        TeacherProfile teacher = teachers.findByUserId(teacherId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Teacher profile not found"));

        return reports.findByTeacherOrderByCreatedAtDesc(teacher).stream()
                .map(ReportResponse::from)
                .toList();
    }

    @PostMapping("/behavior-reports")
    @PreAuthorize("hasRole('TEACHER')")
    @Transactional
    public ResponseEntity<ReportResponse> create(@Valid @RequestBody CreateBehaviorReportRequest request,
            @AuthenticationPrincipal Jwt principal) {
        UUID teacherId = UUID.fromString(principal.getClaimAsString("userId"));
        TeacherProfile teacher = teachers.findByUserId(teacherId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Teacher profile not found"));

        StudentProfile student = students.findById(request.studentId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found"));

        ClassSession classSession = null;
        classSession = sessions.findById(request.classSessionId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Class session not found"));
        if (!classSession.getTeacher().getUserId().equals(teacherId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not authorized for this class session");
        }
        if (!student.getGroupName().equalsIgnoreCase(classSession.getGroupName())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Student does not belong to this class group");
        }

        BehaviorReport report = new BehaviorReport(student, teacher, classSession, request.reportType(),
                request.severity(), request.description());
        BehaviorReport saved = reports.save(report);
        return ResponseEntity.status(HttpStatus.CREATED).body(ReportResponse.from(saved));
    }

    public record CreateBehaviorReportRequest(
            @NotNull UUID studentId,
            @NotNull UUID classSessionId,
            @NotBlank @Size(max = 40) String reportType,
            @NotNull BehaviorReportSeverity severity,
            @NotBlank @Size(min = 10, max = 2000) String description) {}

    public record ReportResponse(
            UUID id,
            UUID studentId,
            String studentName,
            String reportType,
            BehaviorReportSeverity severity,
            String description,
            String status,
            String className) {
        public static ReportResponse from(BehaviorReport report) {
            String className = report.getClassSession() != null
                    ? report.getClassSession().getCourse().getCourseCode() + " · " + report.getClassSession().getGroupName()
                    : "General concern";
            return new ReportResponse(
                    report.getId(),
                    report.getStudent().getUserId(),
                    report.getStudent().getUser().getFullName(),
                    report.getReportType(),
                    report.getSeverity(),
                    report.getDescription(),
                    report.getStatus().name(),
                    className);
        }
    }
}
