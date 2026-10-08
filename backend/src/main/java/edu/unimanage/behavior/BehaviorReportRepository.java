package edu.unimanage.behavior;

import edu.unimanage.user.TeacherProfile;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BehaviorReportRepository extends JpaRepository<BehaviorReport, UUID> {
    List<BehaviorReport> findByTeacherOrderByCreatedAtDesc(TeacherProfile teacher);
}
