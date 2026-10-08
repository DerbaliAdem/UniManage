package edu.unimanage.room;

import jakarta.validation.constraints.NotNull;

public record UpdateRoomStatusRequest(@NotNull RoomStatus status) {}
