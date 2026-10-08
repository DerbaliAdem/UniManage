package edu.unimanage.schedule;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.UUID;

@Entity
@Table(name = "course")
public class Course {
    @Id
    private UUID id;

    @Column(name = "course_code", nullable = false, unique = true, length = 40)
    private String courseCode;

    @Column(nullable = false, length = 160)
    private String name;

    protected Course() {}

    public Course(String courseCode, String name) {
        this.id = UUID.randomUUID();
        this.courseCode = courseCode.trim().toUpperCase();
        this.name = name.trim();
    }

    public UUID getId() { return id; }
    public String getCourseCode() { return courseCode; }
    public String getName() { return name; }
}
