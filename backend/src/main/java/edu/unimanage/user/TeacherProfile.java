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
@Table(name = "teacher_profile")
public class TeacherProfile {
    @Id
    private UUID userId;

    @MapsId
    @OneToOne(optional = false)
    @JoinColumn(name = "user_id")
    private UserAccount user;

    @Column(name = "staff_number", nullable = false, unique = true, length = 40)
    private String staffNumber;

    @Column(nullable = false, length = 120)
    private String department;

    protected TeacherProfile() {}

    public TeacherProfile(UserAccount user, String staffNumber, String department) {
        this.user = user;
        this.staffNumber = staffNumber.trim();
        this.department = department.trim();
    }

    public UUID getUserId() { return userId; }
    public UserAccount getUser() { return user; }
    public String getStaffNumber() { return staffNumber; }
    public String getDepartment() { return department; }

    public void setDepartment(String department) { this.department = department.trim(); }
}
