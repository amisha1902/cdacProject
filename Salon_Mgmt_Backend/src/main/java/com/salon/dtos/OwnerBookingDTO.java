package com.salon.dtos;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import com.salon.entities.enums.BookingStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OwnerBookingDTO {
    // Booking details
    private Long bookingId;
    private LocalDateTime bookingDate;
    private BookingStatus status;
    private BigDecimal totalAmount;
    
    // Customer details
    private Integer customerId;
    private String customerFirstName;
    private String customerLastName;
    private String customerEmail;
    private String customerPhone;
    
    // Service details
    private Long serviceId;
    private String serviceName;
    private String categoryName;
    private LocalDate serviceDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private BigDecimal servicePrice;
    private Integer quantity; // Always 1 for salon services, but keeping for future
}