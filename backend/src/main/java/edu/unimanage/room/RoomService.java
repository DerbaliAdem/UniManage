package edu.unimanage.room;

import edu.unimanage.schedule.ClassSession;
import edu.unimanage.schedule.ClassSessionRepository;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class RoomService {
    private final RoomRepository rooms;
    private final ClassSessionRepository sessions;

    public RoomService(RoomRepository rooms, ClassSessionRepository sessions) {
        this.rooms = rooms;
        this.sessions = sessions;
    }

    @Transactional(readOnly = true)
    public List<RoomResponse> listRooms() {
        return rooms.findAllByOrderByRoomCodeAsc().stream().map(RoomResponse::from).toList();
    }

    @Transactional
    public RoomResponse createRoom(CreateRoomRequest request) {
        if (rooms.existsByRoomCodeIgnoreCase(request.roomCode())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "A room already uses this room code");
        }
        return RoomResponse.from(rooms.save(new Room(request.roomCode(), request.capacity(), request.status(), request.equipment())));
    }

    @Transactional
    public RoomResponse updateStatus(UUID id, RoomStatus status) {
        Room room = rooms.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Room not found"));
        room.updateStatus(status);
        return RoomResponse.from(room);
    }

    @Transactional(readOnly = true)
    public List<RoomSuggestion> suggest(int capacity, short dayOfWeek, LocalTime start, LocalTime end) {
        if (start == null || end == null || !start.isBefore(end) || dayOfWeek < 1 || dayOfWeek > 6 || capacity < 1) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Provide a valid class capacity, weekday, and time range");
        }
        List<ClassSession> daySessions = sessions.findByDayOfWeek(dayOfWeek);
        return rooms.findAllByOrderByRoomCodeAsc().stream()
                .filter(room -> room.getStatus() == RoomStatus.AVAILABLE)
                .filter(room -> room.getCapacity() >= capacity)
                .filter(room -> daySessions.stream().noneMatch(session ->
                        session.getRoom().getId().equals(room.getId())
                                && start.isBefore(session.getEndTime())
                                && end.isAfter(session.getStartTime())))
                .map(room -> new RoomSuggestion(room.getId(), room.getRoomCode(), room.getCapacity(), room.getEquipment(),
                        "Room is available, has enough seats, and has no overlapping class on the selected weekday."))
                .toList();
    }

    public record RoomSuggestion(UUID id, String roomCode, int capacity, String equipment, String reason) {}
}
