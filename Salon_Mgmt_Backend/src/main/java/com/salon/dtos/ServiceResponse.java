package com.salon.dtos;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ServiceResponse {

    private Integer serviceId;
    private String serviceName;
    private BigDecimal basePrice;
    private Integer durationMinutes;
    private String description;
    private String image;
    private Boolean isAvailable;
    private Integer serviceCapacity;
}
