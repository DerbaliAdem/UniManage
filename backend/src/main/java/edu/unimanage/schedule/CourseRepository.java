package edu.unimanage.schedule;

import java.util.UUID;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepository extends JpaRepository<Course, UUID> {
    boolean existsByCourseCodeIgnoreCase(String courseCode);
    Optional<Course> findByCourseCodeIgnoreCase(String courseCode);
}
