package com.salon.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.salon.entities.AvailabilitySlot;

public interface AvailabilitySlotRepository extends JpaRepository<AvailabilitySlot, Long> {

	boolean existsByService_ServiceIdAndDate(Integer serviceId, LocalDate date);

    List<AvailabilitySlot>
    findBySalonIdAndService_ServiceIdAndDateBetweenAndAvailableCapacityGreaterThanEqualOrderByDateAscStartTimeAsc(
            Long salonId,
            Integer serviceId,
            LocalDate from,
            LocalDate to,
            Integer minCapacity
    );

}
