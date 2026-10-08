package edu.unimanage.attendance;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import edu.unimanage.attendance.AttendanceDto.Record;
import edu.unimanage.attendance.AttendanceDto.SubmitAttendanceRequest;
import edu.unimanage.room.Room;
import edu.unimanage.room.RoomStatus;
import edu.unimanage.schedule.ClassSession;
import edu.unimanage.schedule.ClassSessionRepository;
import edu.unimanage.schedule.Course;
import edu.unimanage.user.StudentProfile;
import edu.unimanage.user.StudentProfileRepository;
import edu.unimanage.user.TeacherProfile;
import edu.unimanage.user.TeacherProfileRepository;
import edu.unimanage.user.UserAccount;
import edu.unimanage.user.UserRole;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.server.ResponseStatusException;

@ExtendWith(MockitoExtension.class)
class AttendanceServiceTest {
    @Mock private AttendanceRecordRepository attendanceRecords;
    @Mock private ClassSessionRepository classSessions;
    @Mock private StudentProfileRepository students;
    @Mock private TeacherProfileRepository teachers;

    private UserAccount teacherUser;
    private TeacherProfile teacher;
    private ClassSession session;
    private StudentProfile studentA;
    private StudentProfile studentB;
    private AttendanceService service;

    @BeforeEach
    void setUp() {
        teacherUser = new UserAccount("teacher@example.edu", "hash", "Teacher One", UserRole.TEACHER);
        teacher = new TeacherProfile(teacherUser, "T-001", "Computing");
        ReflectionTestUtils.setField(teacher, "userId", teacherUser.getId());
        session = new ClassSession(
                new Course("CS101", "Computer Science"),
                teacher,
                new Room("R-101", 30, RoomStatus.AVAILABLE, ""),
                "CS-Y1",
                (short) 1,
                LocalTime.of(9, 0),
                LocalTime.of(10, 0));

        studentA = student("a@example.edu", "S-001", "Student A");
        studentB = student("b@example.edu", "S-002", "Student B");
        service = new AttendanceService(attendanceRecords, classSessions, students, teachers);

        when(classSessions.findById(session.getId())).thenReturn(Optional.of(session));
    }

    @Test
    void rejectsAttendanceForAnotherTeachersSession() {
        UserAccount otherTeacherUser = new UserAccount("other@example.edu", "hash", "Other Teacher", UserRole.TEACHER);
        TeacherProfile otherTeacher = new TeacherProfile(otherTeacherUser, "T-002", "Computing");
        ReflectionTestUtils.setField(otherTeacher, "userId", otherTeacherUser.getId());
        Jwt principal = teacherToken(otherTeacherUser.getId());
        when(teachers.findByUserId(otherTeacherUser.getId())).thenReturn(Optional.of(otherTeacher));

        assertThatThrownBy(() -> service.submitAttendance(
                session.getId(),
                new SubmitAttendanceRequest(List.of(new Record(studentA.getUserId(), AttendanceStatus.PRESENT))),
                principal))
                .isInstanceOf(ResponseStatusException.class)
                .extracting(exception -> ((ResponseStatusException) exception).getStatusCode())
                .isEqualTo(HttpStatus.FORBIDDEN);

        verify(attendanceRecords, never()).saveAll(anyList());
    }

    @Test
    void rejectsIncompleteAttendanceBeforeSavingAnyRecords() {
        when(teachers.findByUserId(teacherUser.getId())).thenReturn(Optional.of(teacher));
        when(students.findById(studentA.getUserId())).thenReturn(Optional.of(studentA));
        when(attendanceRecords.findByClassSession_IdAndStudent_UserId(session.getId(), studentA.getUserId()))
                .thenReturn(Optional.empty());
        when(students.findByGroupNameIgnoreCaseOrderByUser_FullNameAsc("CS-Y1"))
                .thenReturn(List.of(studentA, studentB));

        assertThatThrownBy(() -> service.submitAttendance(
                session.getId(),
                new SubmitAttendanceRequest(List.of(new Record(studentA.getUserId(), AttendanceStatus.PRESENT))),
                teacherToken(teacherUser.getId())))
                .isInstanceOf(ResponseStatusException.class)
                .extracting(exception -> ((ResponseStatusException) exception).getStatusCode())
                .isEqualTo(HttpStatus.BAD_REQUEST);

        verify(attendanceRecords, never()).saveAll(anyList());
    }

    @Test
    void savesOneRecordForEveryStudentInTheSessionGroup() {
        when(teachers.findByUserId(teacherUser.getId())).thenReturn(Optional.of(teacher));
        when(students.findById(studentA.getUserId())).thenReturn(Optional.of(studentA));
        when(students.findById(studentB.getUserId())).thenReturn(Optional.of(studentB));
        when(attendanceRecords.findByClassSession_IdAndStudent_UserId(session.getId(), studentA.getUserId()))
                .thenReturn(Optional.empty());
        when(attendanceRecords.findByClassSession_IdAndStudent_UserId(session.getId(), studentB.getUserId()))
                .thenReturn(Optional.empty());
        when(students.findByGroupNameIgnoreCaseOrderByUser_FullNameAsc("CS-Y1"))
                .thenReturn(List.of(studentA, studentB));
        when(attendanceRecords.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));

        var result = service.submitAttendance(
                session.getId(),
                new SubmitAttendanceRequest(List.of(
                        new Record(studentA.getUserId(), AttendanceStatus.PRESENT),
                        new Record(studentB.getUserId(), AttendanceStatus.ABSENT))),
                teacherToken(teacherUser.getId()));

        assertThat(result).hasSize(2);
        assertThat(result).extracting(item -> item.status())
                .containsExactly(AttendanceStatus.PRESENT, AttendanceStatus.ABSENT);
        verify(attendanceRecords).saveAll(anyList());
    }

    private static StudentProfile student(String email, String number, String name) {
        UserAccount user = new UserAccount(email, "hash", name, UserRole.STUDENT);
        StudentProfile profile = new StudentProfile(user, number, "CS-Y1");
        ReflectionTestUtils.setField(profile, "userId", user.getId());
        return profile;
    }

    private static Jwt teacherToken(UUID userId) {
        return Jwt.withTokenValue("test-token")
                .header("alg", "HS256")
                .claim("userId", userId.toString())
                .claim("roles", List.of("ROLE_TEACHER"))
                .build();
    }
}
