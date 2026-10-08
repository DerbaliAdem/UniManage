package edu.unimanage.schedule;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalTime;
import java.util.UUID;

public record CreateClassSessionRequest(
        @NotBlank @Size(max = 40) String courseCode,
        @NotBlank @Size(max = 160) String subject,
        @NotNull UUID teacherId,
        @NotNull UUID roomId,
        @NotBlank @Size(max = 80) String groupName,
        @Min(1) @Max(6) short dayOfWeek,
        @NotNull LocalTime startTime,
        @NotNull LocalTime endTime) {}
