package edu.unimanage.user;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeacherProfileRepository extends JpaRepository<TeacherProfile, UUID> {
    boolean existsByStaffNumberIgnoreCase(String staffNumber);
    Optional<TeacherProfile> findByUserId(UUID userId);
}
