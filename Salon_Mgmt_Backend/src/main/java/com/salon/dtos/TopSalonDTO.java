package com.salon.dtos;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TopSalonDTO {
    private Integer id;
    private String name;
    private String logo;
    private BigDecimal ratingAverage;
    private Integer totalBookings;
    private BigDecimal totalRevenue;
}
