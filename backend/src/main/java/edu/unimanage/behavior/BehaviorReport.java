package edu.unimanage.behavior;

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
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "behavior_report")
public class BehaviorReport {
    @Id
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    private StudentProfile student;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "teacher_id", nullable = false)
    private TeacherProfile teacher;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_session_id")
    private ClassSession classSession;

    @Column(name = "report_date", nullable = false)
    private LocalDate reportDate;

    @Column(name = "report_type", nullable = false, length = 40)
    private String reportType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private BehaviorReportSeverity severity;

    @Column(nullable = false, length = 2000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private BehaviorReportStatus status;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    protected BehaviorReport() {}

    public BehaviorReport(StudentProfile student, TeacherProfile teacher, ClassSession classSession,
            String reportType, BehaviorReportSeverity severity, String description) {
        this.id = UUID.randomUUID();
        this.student = student;
        this.teacher = teacher;
        this.classSession = classSession;
        this.reportDate = LocalDate.now();
        this.reportType = reportType.trim();
        this.severity = severity;
        this.description = description.trim();
        this.status = BehaviorReportStatus.NEEDS_REVIEW;
        this.createdAt = Instant.now();
    }

    public UUID getId() { return id; }
    public StudentProfile getStudent() { return student; }
    public TeacherProfile getTeacher() { return teacher; }
    public ClassSession getClassSession() { return classSession; }
    public LocalDate getReportDate() { return reportDate; }
    public String getReportType() { return reportType; }
    public BehaviorReportSeverity getSeverity() { return severity; }
    public String getDescription() { return description; }
    public BehaviorReportStatus getStatus() { return status; }
    public Instant getCreatedAt() { return createdAt; }
}
