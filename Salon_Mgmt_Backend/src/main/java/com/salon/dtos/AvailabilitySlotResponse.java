package com.salon.dtos;

import java.time.LocalDate;
import java.time.LocalTime;

import com.salon.entities.AvailabilitySlot;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AvailabilitySlotResponse {

    private Long slotId;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private Integer capacity;
    private Integer availableCapacity;

    public static AvailabilitySlotResponse fromEntity(AvailabilitySlot slot) {
        return AvailabilitySlotResponse.builder()
                .slotId(slot.getSlotId())
                .date(slot.getDate())
                .startTime(slot.getStartTime())
                .endTime(slot.getEndTime())
                .capacity(slot.getCapacity())
                .availableCapacity(slot.getAvailableCapacity())
                .build();
    }
}
