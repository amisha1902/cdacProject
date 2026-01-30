package com.salon.entities;


import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.Data;

@Data
public class ServiceResponseDTO {

    private Integer serviceId;
    private String serviceName;
    private String category;
    private String description;
    private BigDecimal price;
    private Integer durationMinutes;
    private Integer capacity;
    private Boolean isAvailable;

    private Integer salonId;
    private Integer staffId;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
