package com.salon.dtos;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDTO {
    private Long totalSalons;
    private Long totalBookings;
    private Double totalRevenue;
    private Double averageRating;
    private Long activeServices;
    private List<RecentBookingDTO> recentBookings;
    private List<TopSalonDTO> topSalons;
}
