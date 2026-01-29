package com.salon.services;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.salon.dtos.SlotResponse;
import com.salon.entities.AvailabilitySlot;
import com.salon.repository.AvailabilitySlotRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetAvailableSlotsService {

    private final AvailabilitySlotRepository slotRepo;

    public List<SlotResponse> getNext3DaysSlots(Long salonId, Integer serviceId) {

        LocalDate today = LocalDate.now();
        LocalDate endDate = today.plusDays(2);

        List<AvailabilitySlot> slots = slotRepo
                .findBySalonIdAndService_ServiceIdAndDateBetweenAndAvailableCapacityGreaterThanOrderByDateAscStartTimeAsc(
                        salonId,
                        serviceId,
                        today,
                        endDate,
                        0
                );

        return slots.stream()
                .map(s -> new SlotResponse(
                        s.getSlotId(),
                        s.getDate(),
                        s.getStartTime(),
                        s.getEndTime(),
                        s.getAvailableCapacity()
                ))
                .toList();
    }
}
