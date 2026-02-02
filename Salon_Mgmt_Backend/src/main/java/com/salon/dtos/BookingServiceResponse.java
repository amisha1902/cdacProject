package com.salon.dtos;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class BookingServiceResponse {
    private Integer serviceId;
    private String serviceName;
    private Integer quantity;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private BigDecimal price;
}
