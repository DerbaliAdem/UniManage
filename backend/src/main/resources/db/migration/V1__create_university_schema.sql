CREATE TABLE app_user (
    id UUID PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(100) NOT NULL,
    full_name VARCHAR(160) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('STUDENT', 'TEACHER', 'ADMIN')),
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE student_profile (
    user_id UUID PRIMARY KEY REFERENCES app_user(id) ON DELETE CASCADE,
    student_number VARCHAR(40) NOT NULL UNIQUE,
    group_name VARCHAR(80) NOT NULL,
    phone VARCHAR(40)
);

CREATE TABLE teacher_profile (
    user_id UUID PRIMARY KEY REFERENCES app_user(id) ON DELETE CASCADE,
    staff_number VARCHAR(40) NOT NULL UNIQUE,
    department VARCHAR(120) NOT NULL
);

CREATE TABLE room (
    id UUID PRIMARY KEY,
    room_code VARCHAR(40) NOT NULL UNIQUE,
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    status VARCHAR(20) NOT NULL CHECK (status IN ('AVAILABLE', 'OCCUPIED', 'OFFLINE', 'MAINTENANCE')),
    equipment TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE course (
    id UUID PRIMARY KEY,
    course_code VARCHAR(40) NOT NULL UNIQUE,
    name VARCHAR(160) NOT NULL
);

CREATE TABLE class_session (
    id UUID PRIMARY KEY,
    course_id UUID NOT NULL REFERENCES course(id),
    teacher_id UUID NOT NULL REFERENCES teacher_profile(user_id),
    room_id UUID NOT NULL REFERENCES room(id),
    group_name VARCHAR(80) NOT NULL,
    day_of_week SMALLINT NOT NULL CHECK (day_of_week BETWEEN 1 AND 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    CHECK (start_time < end_time)
);

CREATE INDEX class_session_room_schedule_idx ON class_session(room_id, day_of_week, start_time, end_time);
CREATE INDEX class_session_teacher_schedule_idx ON class_session(teacher_id, day_of_week, start_time, end_time);
CREATE INDEX class_session_group_schedule_idx ON class_session(group_name, day_of_week, start_time, end_time);

CREATE TABLE attendance_record (
    id UUID PRIMARY KEY,
    class_session_id UUID NOT NULL REFERENCES class_session(id),
    student_id UUID NOT NULL REFERENCES student_profile(user_id),
    class_date DATE NOT NULL,
    status VARCHAR(10) NOT NULL CHECK (status IN ('PRESENT', 'ABSENT')),
    marked_by UUID NOT NULL REFERENCES teacher_profile(user_id),
    marked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (class_session_id, student_id, class_date)
);

CREATE INDEX attendance_student_course_idx ON attendance_record(student_id, class_session_id, class_date);
CREATE INDEX attendance_date_idx ON attendance_record(class_date);

CREATE TABLE behavior_report (
    id UUID PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES student_profile(user_id),
    teacher_id UUID NOT NULL REFERENCES teacher_profile(user_id),
    class_session_id UUID REFERENCES class_session(id),
    report_date DATE NOT NULL,
    report_type VARCHAR(40) NOT NULL,
    severity VARCHAR(10) NOT NULL CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH')),
    description VARCHAR(2000) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'NEEDS_REVIEW' CHECK (status IN ('NEEDS_REVIEW', 'REVIEWED', 'CLOSED')),
    admin_note VARCHAR(2000),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    reviewed_by UUID REFERENCES app_user(id),
    reviewed_at TIMESTAMPTZ
);

CREATE INDEX behavior_report_status_date_idx ON behavior_report(status, report_date DESC);

CREATE TABLE notification (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
    title VARCHAR(180) NOT NULL,
    message VARCHAR(2000) NOT NULL,
    notification_type VARCHAR(30) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    read_at TIMESTAMPTZ
);

CREATE INDEX notification_user_created_idx ON notification(user_id, created_at DESC);
