package com.salon.dtos;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.Set;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GetAllSalon {

	
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
	    private Set<DayOfWeek> workingDays;
	    private BigDecimal ratingAverage;
	    private Integer totalReviews;
}
