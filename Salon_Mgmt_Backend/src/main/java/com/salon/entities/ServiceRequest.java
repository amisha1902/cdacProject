package com.salon.entities;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class ServiceRequest {
    private Integer salonId;
    private Integer staffId;
    private String serviceName;
    private String category;
    private String description;
    private BigDecimal price;
    private Integer durationMinutes;
}
