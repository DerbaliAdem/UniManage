package edu.unimanage.schedule;

import edu.unimanage.room.RoomStatus;
import java.time.LocalTime;
import java.util.UUID;

public record ScheduleResponse(
        UUID id,
        String courseCode,
        String subject,
        String teacherName,
        UUID teacherId,
        String groupName,
        UUID roomId,
        String roomCode,
        RoomStatus roomStatus,
        int dayOfWeek,
        LocalTime startTime,
        LocalTime endTime) {
    public static ScheduleResponse from(ClassSession session) {
        return new ScheduleResponse(session.getId(), session.getCourse().getCourseCode(), session.getCourse().getName(),
                session.getTeacher().getUser().getFullName(), session.getTeacher().getUserId(), session.getGroupName(),
                session.getRoom().getId(), session.getRoom().getRoomCode(), session.getRoom().getStatus(),
                session.getDayOfWeek(), session.getStartTime(), session.getEndTime());
    }
}
