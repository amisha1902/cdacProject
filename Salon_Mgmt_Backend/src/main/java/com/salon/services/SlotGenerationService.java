package com.salon.services;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.salon.entities.AvailabilitySlot;
import com.salon.entities.Salon;
import com.salon.repository.AvailabilitySlotRepository;
import com.salon.repository.ServiceRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SlotGenerationService {

    private static final int SLOT_DURATION_MINUTES = 60;

    private final AvailabilitySlotRepository slotRepo;
    private final ServiceRepository serviceRepo;

    @Transactional
    public void generateSlotsForDateRange(LocalDate fromDate, LocalDate toDate) {

        List<com.salon.entities.Service> services = serviceRepo.findAllActiveServices();

        for (com.salon.entities.Service service : services) {
            generateSlotsForService(service, fromDate, toDate);
        }
    }

    private void generateSlotsForService(com.salon.entities.Service service, LocalDate from, LocalDate to) {

        Salon salon = service.getSalon();
        LocalTime opening = salon.getOpeningTime();
        LocalTime closing = salon.getClosingTime();

        List<AvailabilitySlot> slotsToSave = new ArrayList<>();

        for (LocalDate date = from; !date.isAfter(to); date = date.plusDays(1)) {

            // Skip non-working days
            DayOfWeek day = date.getDayOfWeek();
            if (!salon.getWorkingDays().contains(day)) continue;

            // If slots already exist for this service+date, skip entirely (idempotent)
            if (slotRepo.existsByService_ServiceIdAndDate(service.getServiceId(), date)) {
                continue;
            }

            LocalTime start = opening;

            while (start.plusMinutes(SLOT_DURATION_MINUTES).compareTo(closing) <= 0) {

                AvailabilitySlot slot = new AvailabilitySlot();
                slot.setSalonId(salon.getSalonId());
                slot.setService(service);
                slot.setDate(date);
                slot.setStartTime(start);
                slot.setEndTime(start.plusMinutes(SLOT_DURATION_MINUTES));
                slot.setCapacity(4);              // or service-specific capacity
                slot.setAvailableCapacity(4);
                slot.setBooked(false);

                slotsToSave.add(slot);
                start = start.plusMinutes(SLOT_DURATION_MINUTES);
            }
        }

        if (!slotsToSave.isEmpty()) {
            slotRepo.saveAll(slotsToSave);
        }
    }
}
