package edu.unimanage.room;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "room")
public class Room {
    @Id
    private UUID id;

    @Column(name = "room_code", nullable = false, unique = true, length = 40)
    private String roomCode;

    @Column(nullable = false)
    private int capacity;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private RoomStatus status;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String equipment;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected Room() {}

    public Room(String roomCode, int capacity, RoomStatus status, String equipment) {
        this.id = UUID.randomUUID();
        this.roomCode = roomCode.trim().toUpperCase();
        this.capacity = capacity;
        this.status = status;
        this.equipment = equipment == null ? "" : equipment.trim();
        this.createdAt = Instant.now();
        this.updatedAt = this.createdAt;
    }

    public void updateStatus(RoomStatus status) {
        this.status = status;
        this.updatedAt = Instant.now();
    }

    public UUID getId() { return id; }
    public String getRoomCode() { return roomCode; }
    public int getCapacity() { return capacity; }
    public RoomStatus getStatus() { return status; }
    public String getEquipment() { return equipment; }
}
