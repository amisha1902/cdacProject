package com.salon.dtos;

import java.math.BigDecimal;
import java.util.List;

import com.salon.entities.enums.BookingStatus;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class BookingResponse {
    private Long bookingId;
    private BookingStatus status;
    private BigDecimal totalAmount;
    private List<BookingServiceResponse> services;
}

