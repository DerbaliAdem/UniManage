package edu.unimanage.room;

import jakarta.validation.Valid;
import java.net.URI;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class RoomController {
    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @GetMapping("/rooms")
    public List<RoomResponse> listRooms() {
        return roomService.listRooms();
    }

    @GetMapping("/rooms/suggestions")
    public List<RoomService.RoomSuggestion> suggest(
            @RequestParam int capacity,
            @RequestParam short dayOfWeek,
            @RequestParam LocalTime startTime,
            @RequestParam LocalTime endTime) {
        return roomService.suggest(capacity, dayOfWeek, startTime, endTime);
    }

    @PostMapping("/admin/rooms")
    public ResponseEntity<RoomResponse> create(@Valid @RequestBody CreateRoomRequest request) {
        RoomResponse room = roomService.createRoom(request);
        return ResponseEntity.created(URI.create("/api/rooms/" + room.id())).body(room);
    }

    @PatchMapping("/admin/rooms/{id}/status")
    public RoomResponse updateStatus(@PathVariable UUID id, @Valid @RequestBody UpdateRoomStatusRequest request) {
        return roomService.updateStatus(id, request.status());
    }
}
