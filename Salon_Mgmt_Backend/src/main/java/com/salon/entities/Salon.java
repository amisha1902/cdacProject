package com.salon.entities;

import java.math.BigDecimal;
import java.time.LocalTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "salon")
public class Salon extends BaseEntity{

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "salon_id")
	private Integer salonId;
	
	@ManyToOne(optional = false)
    @JoinColumn(name = "owner_id", nullable = false)
    private Owner owner;

    @Column(name = "salon_name", nullable = false, length = 255)
    private String salonName;

    @Column(length = 255)
    private String address;

    @Column(length = 100)
    private String city;

    @Column(length = 100)
    private String state;

    @Column(length = 10)
    private String pincode;

    @Column(length = 20)
    private String phone;

    @Column(length = 255)
    private String email;

    @Column(length = 255)
    private String logo;

    @Column(name = "gallery_images", columnDefinition = "json")
    private String galleryImages;

    @Column(name = "opening_time")
    private LocalTime openingTime;

    @Column(name = "closing_time")
    private LocalTime closingTime;

    @Column(name = "working_days", columnDefinition = "json")
    private String workingDays;

    @Column(name = "is_approved", nullable = false)
    private Boolean isApproved = false;

    @Column(name = "rating_average", precision = 3, scale = 2)
    private BigDecimal ratingAverage = BigDecimal.ZERO;

    @Column(name = "total_reviews")
    private Integer totalReviews = 0;

}
	
	
	
}
