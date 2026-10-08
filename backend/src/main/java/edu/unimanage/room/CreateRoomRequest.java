package edu.unimanage.room;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record CreateRoomRequest(
        @NotBlank @Size(max = 40) String roomCode,
        @Positive int capacity,
        @NotNull RoomStatus status,
        @Size(max = 2000) String equipment) {}
