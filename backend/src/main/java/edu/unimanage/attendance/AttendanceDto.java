package edu.unimanage.attendance;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public final class AttendanceDto {
    private AttendanceDto() {}

    public record SubmitAttendanceRequest(List<Record> records) {}
    public record Record(UUID studentId, AttendanceStatus status) {}

    public record AttendanceItem(
            UUID id,
            UUID studentId,
            String studentName,
            String studentNumber,
            String groupName,
            AttendanceStatus status,
            LocalDate classDate,
            UUID classSessionId,
            String courseCode,
            String courseName) {}

    public record StudentSummary(
            UUID studentId,
            double attendancePercentage,
            long attendedClasses,
            long missedClasses,
            String riskLevel,
            String message) {}
}
