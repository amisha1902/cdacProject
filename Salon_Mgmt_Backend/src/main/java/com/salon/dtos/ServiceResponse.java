package com.salon.dtos;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import com.salon.entities.AvailabilitySlot;
import com.salon.entities.Service;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ServiceResponse {

    private Integer serviceId;
    private String serviceName;
    private BigDecimal basePrice;
    private Integer durationMinutes;
    private String description;
    private String image;
//    private Boolean isAvailable;
//    private List<AvailabilitySlotResponse> slots;

    
}
