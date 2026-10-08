package edu.unimanage.room;

import java.util.UUID;

public record RoomResponse(UUID id, String roomCode, int capacity, RoomStatus status, String equipment) {
    public static RoomResponse from(Room room) {
        return new RoomResponse(room.getId(), room.getRoomCode(), room.getCapacity(), room.getStatus(), room.getEquipment());
    }
}
