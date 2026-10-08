package edu.unimanage.schedule;

import edu.unimanage.room.Room;
import edu.unimanage.user.TeacherProfile;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalTime;
import java.util.UUID;

@Entity
@Table(name = "class_session")
public class ClassSession {
    @Id
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "teacher_id", nullable = false)
    private TeacherProfile teacher;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @Column(name = "group_name", nullable = false, length = 80)
    private String groupName;

    @Column(name = "day_of_week", nullable = false, columnDefinition = "smallint")
    private short dayOfWeek;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    protected ClassSession() {}

    public ClassSession(Course course, TeacherProfile teacher, Room room, String groupName, short dayOfWeek, LocalTime startTime, LocalTime endTime) {
        this.id = UUID.randomUUID();
        this.course = course;
        this.teacher = teacher;
        this.room = room;
        this.groupName = groupName.trim();
        this.dayOfWeek = dayOfWeek;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public UUID getId() { return id; }
    public Course getCourse() { return course; }
    public TeacherProfile getTeacher() { return teacher; }
    public Room getRoom() { return room; }
    public String getGroupName() { return groupName; }
    public short getDayOfWeek() { return dayOfWeek; }
    public LocalTime getStartTime() { return startTime; }
    public LocalTime getEndTime() { return endTime; }
}
