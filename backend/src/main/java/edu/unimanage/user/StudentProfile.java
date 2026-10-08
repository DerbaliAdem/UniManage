package edu.unimanage.user;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.util.UUID;

@Entity
@Table(name = "student_profile")
public class StudentProfile {
    @Id
    private UUID userId;

    @MapsId
    @OneToOne(optional = false)
    @JoinColumn(name = "user_id")
    private UserAccount user;

    @Column(name = "student_number", nullable = false, unique = true, length = 40)
    private String studentNumber;

    @Column(name = "group_name", nullable = false, length = 80)
    private String groupName;

    @Column(length = 40)
    private String phone;

    protected StudentProfile() {}

    public StudentProfile(UserAccount user, String studentNumber, String groupName) {
        this.user = user;
        this.studentNumber = studentNumber.trim();
        this.groupName = groupName.trim();
    }

    public UUID getUserId() { return userId; }
    public UserAccount getUser() { return user; }
    public String getStudentNumber() { return studentNumber; }
    public String getGroupName() { return groupName; }
    public String getPhone() { return phone; }

    public void setPhone(String phone) { this.phone = phone; }
    public void setGroupName(String groupName) { this.groupName = groupName.trim(); }
}
