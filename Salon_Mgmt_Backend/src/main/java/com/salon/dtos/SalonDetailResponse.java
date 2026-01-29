package com.salon.dtos;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class SalonDetailResponse {
    private Long salonId;
    private String salonName;
    private String address;
    private String city;
    private String state;
    private String pincode;
    private String phone;
    private String email;
    private String logo;
    private String[] galleryImages;
    private LocalTime openingTime;
    private LocalTime closingTime;
    private List<DayOfWeek> workingDays;
    private BigDecimal ratingAverage;
    private Integer totalReviews;
    private List<CategoryWithServices> categories;
}
