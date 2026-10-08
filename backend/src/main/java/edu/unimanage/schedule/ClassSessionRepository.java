package edu.unimanage.schedule;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClassSessionRepository extends JpaRepository<ClassSession, UUID> {
    List<ClassSession> findAllByOrderByDayOfWeekAscStartTimeAsc();
    List<ClassSession> findByDayOfWeek(short dayOfWeek);
    List<ClassSession> findByTeacher_UserIdOrderByDayOfWeekAscStartTimeAsc(UUID teacherId);
    List<ClassSession> findByGroupNameIgnoreCaseOrderByDayOfWeekAscStartTimeAsc(String groupName);
}
