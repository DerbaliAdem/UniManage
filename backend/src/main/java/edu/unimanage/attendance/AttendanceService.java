package edu.unimanage.attendance;

import edu.unimanage.attendance.AttendanceDto.AttendanceItem;
import edu.unimanage.attendance.AttendanceDto.Record;
import edu.unimanage.attendance.AttendanceDto.StudentSummary;
import edu.unimanage.attendance.AttendanceDto.SubmitAttendanceRequest;
import edu.unimanage.schedule.ClassSession;
import edu.unimanage.schedule.ClassSessionRepository;
import edu.unimanage.user.StudentProfile;
import edu.unimanage.user.StudentProfileRepository;
import edu.unimanage.user.TeacherProfile;
import edu.unimanage.user.TeacherProfileRepository;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AttendanceService {
    private final AttendanceRecordRepository attendanceRecords;
    private final ClassSessionRepository classSessions;
    private final StudentProfileRepository students;
    private final TeacherProfileRepository teachers;

    public AttendanceService(AttendanceRecordRepository attendanceRecords,
            ClassSessionRepository classSessions,
            StudentProfileRepository students,
            TeacherProfileRepository teachers) {
        this.attendanceRecords = attendanceRecords;
        this.classSessions = classSessions;
        this.students = students;
        this.teachers = teachers;
    }

    @Transactional(readOnly = true)
    public List<AttendanceItem> getAttendanceForSession(UUID sessionId, Jwt principal) {
        ClassSession session = classSessions.findById(sessionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Class session not found"));
        enforceSessionAccess(session, principal);

        return attendanceRecords.findByClassSession_IdOrderByStudent_User_FullNameAsc(session.getId())
                .stream()
                .map(AttendanceService::toItem)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AttendanceItem> getAttendanceForStudent(UUID studentId, Jwt principal) {
        StudentProfile student = students.findById(studentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found"));

        UUID currentUserId = UUID.fromString(principal.getClaimAsString("userId"));
        List<String> roles = principal.getClaimAsStringList("roles");
        boolean isAdmin = roles != null && roles.contains("ROLE_ADMIN");
        boolean isTeacher = roles != null && roles.contains("ROLE_TEACHER");
        boolean isStudent = roles != null && roles.contains("ROLE_STUDENT");
        if (!isAdmin && isStudent && !student.getUserId().equals(currentUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only view your own attendance");
        }
        if (!isAdmin && !isTeacher && !isStudent) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not authorized to view attendance");
        }

        return attendanceRecords.findByStudent_UserIdOrderByClassDateDesc(student.getUserId())
                .stream()
                .filter(record -> !isTeacher || isAdmin
                        || record.getClassSession().getTeacher().getUserId().equals(currentUserId))
                .map(AttendanceService::toItem)
                .toList();
    }

    public StudentSummary getStudentSummary(UUID studentId) {
        StudentProfile student = students.findById(studentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found"));

        List<AttendanceRecord> records = attendanceRecords.findByStudent_UserIdOrderByClassDateDesc(student.getUserId());
        long attended = records.stream().filter(r -> r.getStatus() == AttendanceStatus.PRESENT).count();
        long missed = records.stream().filter(r -> r.getStatus() == AttendanceStatus.ABSENT).count();
        long total = records.size();
        double percentage = total == 0 ? 0.0 : (attended * 100.0) / total;

        String riskLevel;
        String message;
        if (percentage >= 80.0) {
            riskLevel = "SAFE";
            message = "Attendance is healthy and within the recommended range.";
        } else if (percentage >= 70.0) {
            riskLevel = "WARNING";
            message = "Attendance is below the recommended threshold and needs attention.";
        } else {
            riskLevel = "CRITICAL";
            message = "Attendance is below the critical threshold. Please review the student record.";
        }

        return new StudentSummary(student.getUserId(), percentage, attended, missed, riskLevel, message);
    }

    @Transactional
    public List<AttendanceItem> submitAttendance(UUID sessionId, SubmitAttendanceRequest request, Jwt principal) {
        ClassSession session = classSessions.findById(sessionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Class session not found"));

        UUID currentUserId = UUID.fromString(principal.getClaimAsString("userId"));
        List<String> roles = principal.getClaimAsStringList("roles");
        boolean isAdmin = roles != null && roles.contains("ROLE_ADMIN");
        boolean isTeacher = roles != null && roles.contains("ROLE_TEACHER");
        TeacherProfile teacher = null;

        if (isTeacher) {
            teacher = teachers.findByUserId(currentUserId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Teacher profile not found"));
            if (!session.getTeacher().getUserId().equals(currentUserId)) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only mark attendance for your own class sessions");
            }
        } else if (!isAdmin) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only teachers and administrators can mark attendance");
        }

        if (request == null || request.records() == null || request.records().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Attendance payload cannot be empty");
        }

        Set<UUID> seenStudentIds = new HashSet<>();
        List<AttendanceRecord> recordsToSave = new ArrayList<>();
        for (Record record : request.records()) {
            if (record == null || record.studentId() == null || record.status() == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Each attendance record must include a student and status");
            }
            if (!seenStudentIds.add(record.studentId())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Duplicate student entries in attendance submission");
            }

            StudentProfile student = students.findById(record.studentId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Student not found: " + record.studentId()));
            if (!student.getGroupName().equalsIgnoreCase(session.getGroupName())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Student " + student.getStudentNumber() + " does not belong to this class group");
            }

            AttendanceRecord existing = attendanceRecords.findByClassSession_IdAndStudent_UserId(sessionId, record.studentId()).orElse(null);
            AttendanceRecord attendance = existing != null
                    ? existing
                    : new AttendanceRecord(session, student, LocalDate.now(), record.status(),
                            teacher != null ? teacher : session.getTeacher());
            attendance.setStatus(record.status());
            recordsToSave.add(attendance);
        }

        Set<UUID> rosterIds = students.findByGroupNameIgnoreCaseOrderByUser_FullNameAsc(session.getGroupName())
                .stream()
                .map(StudentProfile::getUserId)
                .collect(java.util.stream.Collectors.toSet());
        if (!seenStudentIds.equals(rosterIds)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Attendance must include exactly one status for every student in the class group");
        }

        return attendanceRecords.saveAll(recordsToSave).stream().map(AttendanceService::toItem).toList();
    }

    @Transactional
    public AttendanceItem updateAttendance(UUID attendanceId, AttendanceStatus status, Jwt principal) {
        if (status == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Attendance status is required");
        }
        AttendanceRecord attendance = attendanceRecords.findById(attendanceId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Attendance record not found"));

        UUID currentUserId = UUID.fromString(principal.getClaimAsString("userId"));
        List<String> roles = principal.getClaimAsStringList("roles");
        boolean isAdmin = roles != null && roles.contains("ROLE_ADMIN");
        boolean isTeacher = roles != null && roles.contains("ROLE_TEACHER");
        if (!isAdmin && (!isTeacher || !attendance.getClassSession().getTeacher().getUserId().equals(currentUserId))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You may not edit this attendance record");
        }

        attendance.setStatus(status);
        return toItem(attendanceRecords.save(attendance));
    }

    private void enforceSessionAccess(ClassSession session, Jwt principal) {
        UUID currentUserId = UUID.fromString(principal.getClaimAsString("userId"));
        List<String> roles = principal.getClaimAsStringList("roles");
        boolean isAdmin = roles != null && roles.contains("ROLE_ADMIN");
        boolean isTeacher = roles != null && roles.contains("ROLE_TEACHER");
        if (!isAdmin && (!isTeacher || !session.getTeacher().getUserId().equals(currentUserId))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not authorized to view this class attendance");
        }
    }

    private static AttendanceItem toItem(AttendanceRecord record) {
        var student = record.getStudent();
        var user = student.getUser();
        var session = record.getClassSession();
        return new AttendanceItem(
                record.getId(),
                student.getUserId(),
                user.getFullName(),
                student.getStudentNumber(),
                student.getGroupName(),
                record.getStatus(),
                record.getClassDate(),
                session.getId(),
                session.getCourse().getCourseCode(),
                session.getCourse().getName());
    }
}
