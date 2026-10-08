package edu.unimanage.attendance;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AttendanceRecordRepository extends JpaRepository<AttendanceRecord, UUID> {
    List<AttendanceRecord> findByClassSession_IdOrderByStudent_User_FullNameAsc(UUID classSessionId);
    List<AttendanceRecord> findByStudent_UserIdOrderByClassDateDesc(UUID studentId);
    Optional<AttendanceRecord> findByClassSession_IdAndStudent_UserId(UUID classSessionId, UUID studentId);
    boolean existsByClassSession_IdAndStudent_UserId(UUID classSessionId, UUID studentId);
}
