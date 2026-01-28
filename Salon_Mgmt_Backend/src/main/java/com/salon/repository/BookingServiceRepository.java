package com.salon.repository;

import java.time.LocalDate;
import java.time.LocalTime;

import org.springframework.data.jpa.repository.JpaRepository;

import com.salon.entities.BookingService;
import com.salon.entities.enums.BookingStatus;

public interface BookingServiceRepository extends JpaRepository<BookingService, Long> {
	boolean existsByService_ServiceIdAndDateAndStartTimeAndBooking_StatusNot(
		    Integer serviceId, LocalDate date, LocalTime startTime, BookingStatus status
		);
}
