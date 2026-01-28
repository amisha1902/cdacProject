package com.salon.dtos;

import java.math.BigDecimal;
import java.time.*;

import lombok.*;

@Getter @Setter
public class CartItemResponse {
    private Integer itemId;
    private Integer serviceId;
    private String serviceName;
    private BigDecimal price;
    private Integer quantity;
    private LocalDate date;
    private LocalTime time;
}
