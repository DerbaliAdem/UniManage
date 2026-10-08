package edu.unimanage.dashboard;

import edu.unimanage.schedule.ClassSessionRepository;
import edu.unimanage.schedule.ScheduleResponse;
import edu.unimanage.schedule.ScheduleService;
import edu.unimanage.user.StudentProfile;
import edu.unimanage.user.StudentProfileRepository;
import edu.unimanage.user.TeacherProfile;
import edu.unimanage.user.TeacherProfileRepository;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api")
public class DashboardController {
    private final ScheduleService scheduleService;
    private final StudentProfileRepository students;
    private final TeacherProfileRepository teachers;
    private final ClassSessionRepository classSessions;

    public DashboardController(ScheduleService scheduleService,
            StudentProfileRepository students,
            TeacherProfileRepository teachers,
            ClassSessionRepository classSessions) {
        this.scheduleService = scheduleService;
        this.students = students;
        this.teachers = teachers;
        this.classSessions = classSessions;
    }

    @GetMapping("/students/me/dashboard")
    @PreAuthorize("hasRole('STUDENT')")
    public Map<String, Object> studentDashboard(@AuthenticationPrincipal Jwt principal) {
        UUID userId = UUID.fromString(principal.getClaimAsString("userId"));
        StudentProfile student = students.findByUserId(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student profile not found"));
        List<ScheduleResponse> classes = scheduleService.listFor(principal);
        List<ScheduleResponse> todayClasses = classes.stream()
                .filter(session -> session.dayOfWeek() == todayDayOfWeek())
                .toList();

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("studentId", student.getUserId());
        body.put("groupName", student.getGroupName());
        body.put("todayClasses", todayClasses);
        body.put("nextClass", todayClasses.isEmpty() ? null : todayClasses.getFirst());
        body.put("totalClassesToday", todayClasses.size());
        return body;
    }

    @GetMapping("/teachers/me/dashboard")
    @PreAuthorize("hasRole('TEACHER')")
    public Map<String, Object> teacherDashboard(@AuthenticationPrincipal Jwt principal) {
        UUID userId = UUID.fromString(principal.getClaimAsString("userId"));
        TeacherProfile teacher = teachers.findByUserId(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Teacher profile not found"));
        List<ScheduleResponse> classes = scheduleService.listFor(principal);
        List<ScheduleResponse> todayClasses = classes.stream()
                .filter(session -> session.dayOfWeek() == todayDayOfWeek())
                .toList();

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("teacherId", teacher.getUserId());
        body.put("department", teacher.getDepartment());
        body.put("todayClasses", todayClasses);
        body.put("upcomingClasses", classes.size() > 0 ? classes.subList(0, Math.min(3, classes.size())) : List.of());
        body.put("totalClassesToday", todayClasses.size());
        return body;
    }

    private short todayDayOfWeek() {
        return (short) LocalDate.now().getDayOfWeek().getValue();
    }
}
