ALTER TABLE attendance_record
    DROP CONSTRAINT IF EXISTS attendance_record_class_session_id_student_id_class_date_key;

ALTER TABLE attendance_record
    ADD CONSTRAINT uk_attendance_session_student UNIQUE (class_session_id, student_id);
