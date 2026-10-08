package edu.unimanage.attendance;

import edu.unimanage.schedule.ClassSession;
import edu.unimanage.user.StudentProfile;
import edu.unimanage.user.TeacherProfile;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "attendance_record",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_attendance_session_student", columnNames = {"class_session_id", "student_id"})
        })
public class AttendanceRecord {
    @Id
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "class_session_id", nullable = false)
    private ClassSession classSession;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    private StudentProfile student;

    @Column(name = "class_date", nullable = false)
    private LocalDate classDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private AttendanceStatus status;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "marked_by", nullable = false)
    private TeacherProfile markedBy;

    @Column(name = "marked_at", nullable = false)
    private Instant markedAt;

    protected AttendanceRecord() {}

    public AttendanceRecord(ClassSession classSession, StudentProfile student, LocalDate classDate,
            AttendanceStatus status, TeacherProfile markedBy) {
        this.id = UUID.randomUUID();
        this.classSession = classSession;
        this.student = student;
        this.classDate = classDate;
        this.status = status;
        this.markedBy = markedBy;
        this.markedAt = Instant.now();
    }

    public UUID getId() { return id; }
    public ClassSession getClassSession() { return classSession; }
    public StudentProfile getStudent() { return student; }
    public LocalDate getClassDate() { return classDate; }
    public AttendanceStatus getStatus() { return status; }
    public TeacherProfile getMarkedBy() { return markedBy; }
    public Instant getMarkedAt() { return markedAt; }

    public void setStatus(AttendanceStatus status) {
        this.status = status;
        this.markedAt = Instant.now();
    }
}
