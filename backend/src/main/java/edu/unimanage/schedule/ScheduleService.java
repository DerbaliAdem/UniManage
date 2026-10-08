package edu.unimanage.schedule;

import edu.unimanage.room.Room;
import edu.unimanage.room.RoomRepository;
import edu.unimanage.room.RoomStatus;
import edu.unimanage.user.StudentProfile;
import edu.unimanage.user.StudentProfileRepository;
import edu.unimanage.user.TeacherProfile;
import edu.unimanage.user.TeacherProfileRepository;
import edu.unimanage.user.UserRole;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ScheduleService {
    private final ClassSessionRepository sessions;
    private final CourseRepository courses;
    private final RoomRepository rooms;
    private final TeacherProfileRepository teachers;
    private final StudentProfileRepository students;

    public ScheduleService(ClassSessionRepository sessions, CourseRepository courses, RoomRepository rooms,
            TeacherProfileRepository teachers, StudentProfileRepository students) {
        this.sessions = sessions;
        this.courses = courses;
        this.rooms = rooms;
        this.teachers = teachers;
        this.students = students;
    }

    @Transactional(readOnly = true)
    public List<ScheduleResponse> listFor(Jwt principal) {
        UUID userId = UUID.fromString(principal.getClaimAsString("userId"));
        List<String> roles = principal.getClaimAsStringList("roles");
        if (roles.contains("ROLE_ADMIN")) {
            return sessions.findAllByOrderByDayOfWeekAscStartTimeAsc().stream().map(ScheduleResponse::from).toList();
        }
        if (roles.contains("ROLE_TEACHER")) {
            return listByTeacher(userId);
        }
        if (roles.contains("ROLE_STUDENT")) {
            StudentProfile student = students.findByUserId(userId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student profile not found"));
            return sessions.findByGroupNameIgnoreCaseOrderByDayOfWeekAscStartTimeAsc(student.getGroupName())
                    .stream().map(ScheduleResponse::from).toList();
        }
        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "This account cannot view schedules");
    }

    @Transactional(readOnly = true)
    public List<ScheduleResponse> listByTeacher(UUID teacherId) {
        return sessions.findByTeacher_UserIdOrderByDayOfWeekAscStartTimeAsc(teacherId)
                .stream()
                .map(ScheduleResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<TeacherRosterStudent> listTeacherRoster(UUID teacherId) {
        List<ClassSession> classes = sessions.findByTeacher_UserIdOrderByDayOfWeekAscStartTimeAsc(teacherId);
        return classes.stream()
                .map(ClassSession::getGroupName)
                .distinct()
                .flatMap(group -> students.findByGroupNameIgnoreCaseOrderByUser_FullNameAsc(group).stream())
                .map(student -> new TeacherRosterStudent(student.getUserId(), student.getUser().getFullName(),
                        student.getStudentNumber(), student.getGroupName()))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ClassStudentSummary> listStudentsForSession(UUID sessionId, Jwt principal) {
        ClassSession session = sessions.findById(sessionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Class session not found"));

        if (principal != null && principal.getClaimAsStringList("roles") != null
                && principal.getClaimAsStringList("roles").contains("ROLE_TEACHER")
                && !UUID.fromString(principal.getClaimAsString("userId")).equals(session.getTeacher().getUserId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not authorized to view this class roster");
        }

        return students.findByGroupNameIgnoreCaseOrderByUser_FullNameAsc(session.getGroupName()).stream()
                .map(student -> new ClassStudentSummary(student.getUserId(), student.getUser().getFullName(),
                        student.getStudentNumber(), student.getGroupName()))
                .toList();
    }

    @Transactional
    public ScheduleResponse create(CreateClassSessionRequest request) {
        if (!request.startTime().isBefore(request.endTime())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Class end time must be after start time");
        }
        Course course = courses.findByCourseCodeIgnoreCase(request.courseCode()).orElseGet(() ->
                courses.save(new Course(request.courseCode(), request.subject())));
        TeacherProfile teacher = teachers.findById(request.teacherId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Teacher profile not found"));
        Room room = rooms.findById(request.roomId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Room not found"));
        if (room.getStatus() != RoomStatus.AVAILABLE) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Classes can only be assigned to an available room");
        }
        if (room.getCapacity() < students.countByGroupNameIgnoreCase(request.groupName().trim())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Room capacity is below the student group size");
        }

        List<ClassSession> daySessions = sessions.findByDayOfWeek(request.dayOfWeek());
        for (ClassSession existing : daySessions) {
            if (!overlaps(request.startTime(), request.endTime(), existing.getStartTime(), existing.getEndTime())) continue;
            if (existing.getRoom().getId().equals(room.getId())) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "The room already has a class during that time");
            }
            if (existing.getTeacher().getUserId().equals(teacher.getUserId())) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "The teacher already has a class during that time");
            }
            if (existing.getGroupName().equalsIgnoreCase(request.groupName())) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "The group already has a class during that time");
            }
        }

        ClassSession created = sessions.save(new ClassSession(course, teacher, room, request.groupName(), request.dayOfWeek(), request.startTime(), request.endTime()));
        return ScheduleResponse.from(created);
    }

    @Transactional
    public void delete(UUID id) {
        if (!sessions.existsById(id)) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Class session not found");
        sessions.deleteById(id);
    }

    private boolean overlaps(LocalTime firstStart, LocalTime firstEnd, LocalTime secondStart, LocalTime secondEnd) {
        return firstStart.isBefore(secondEnd) && firstEnd.isAfter(secondStart);
    }

    public record TeacherRosterStudent(UUID studentId, String fullName, String studentNumber, String groupName) {}

    public record ClassStudentSummary(UUID studentId, String fullName, String studentNumber, String groupName) {}
}
