package com.salon.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServiceDTO {
    private Integer serviceId;
    private String serviceName;
    private String description;
    private BigDecimal basePrice;
    private Integer durationMinutes;
    private Boolean isAvailable = true;
    private String image;
    private Integer serviceCapacity = 5;
}
