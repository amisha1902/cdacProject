package com.salon.services;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.salon.dtos.SlotGenerationRequest;
import com.salon.entities.AvailabilitySlot;
import com.salon.entities.Salon;
//import com.salon.entities.Service as SalonService;
import com.salon.repository.AvailabilitySlotRepository;
import com.salon.repository.ServiceRepository;
import com.salon.util.SlotTimeGenerator;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SlotGenerationService {

    private final AvailabilitySlotRepository slotRepo;
    private final ServiceRepository serviceRepo;

    @Transactional
    public void generateSlots(Integer serviceId, SlotGenerationRequest request) {

        com.salon.entities.Service service = serviceRepo.findById(serviceId)
                .orElseThrow(() -> new RuntimeException("Service not found"));

        // Prevent duplicate generation
        boolean alreadyExists = slotRepo.existsByService_ServiceIdAndDateBetween(
                serviceId,
                request.getFromDate(),
                request.getToDate()
        );

        if (alreadyExists) {
            throw new RuntimeException("Slots already generated for this date range");
        }

        Salon salon = service.getSalon();
        LocalTime opening = salon.getOpeningTime();
        LocalTime closing = salon.getClosingTime();
        int slotMinutes = request.getSlotMinutes();

        List<LocalTime> startTimes = SlotTimeGenerator.generateStartTimes(opening, closing, slotMinutes);

        List<AvailabilitySlot> slotsToSave = new ArrayList<>();

        for (LocalDate date = request.getFromDate();
             !date.isAfter(request.getToDate());
             date = date.plusDays(1)) {

            DayOfWeek day = date.getDayOfWeek();
            if (!salon.getWorkingDays().contains(day)) continue;

            for (LocalTime start : startTimes) {
                AvailabilitySlot slot = new AvailabilitySlot();
                slot.setSalonId(salon.getSalonId());
                slot.setService(service);
                slot.setDate(date);
                slot.setStartTime(start);
                slot.setEndTime(start.plusMinutes(slotMinutes));
                slot.setCapacity(request.getCapacity());
                slot.setAvailableCapacity(request.getCapacity());
                slotsToSave.add(slot);
            }
        }

        slotRepo.saveAll(slotsToSave);
    }
}
