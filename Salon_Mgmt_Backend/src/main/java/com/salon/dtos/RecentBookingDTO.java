package com.salon.dtos;

import java.math.BigDecimal;
import java.time.LocalDate;
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
public class RecentBookingDTO {
    private Long id;
    private String customerName;
    private String salonName;
    private LocalDate date;
    private LocalTime time;
    private BookingStatus status;
    private BigDecimal amount;
}
