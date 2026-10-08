package edu.unimanage.user;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentProfileRepository extends JpaRepository<StudentProfile, UUID> {
    Optional<StudentProfile> findByStudentNumberIgnoreCase(String studentNumber);
    boolean existsByStudentNumberIgnoreCase(String studentNumber);
    Optional<StudentProfile> findByUserId(UUID userId);
    java.util.List<StudentProfile> findByGroupNameIgnoreCaseOrderByUser_FullNameAsc(String groupName);
    long countByGroupNameIgnoreCase(String groupName);
}
