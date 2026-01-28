package com.salon.entities;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.EnumSet;
import java.util.Set;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "salon")
@Getter
@Setter
public class Salon extends BaseEntity{

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "salon_id")
	private Long salonId; //////changed
	
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

    @ElementCollection(targetClass = DayOfWeek.class)
    @CollectionTable(
        name = "salon_working_days",
        joinColumns = @JoinColumn(name = "salon_id", referencedColumnName = "salon_id")
    )
    @Column(name = "day_of_week")  // column for enum values
    @Enumerated(EnumType.STRING)
    private Set<DayOfWeek> workingDays = EnumSet.of(
        DayOfWeek.MONDAY,
        DayOfWeek.TUESDAY,
        DayOfWeek.WEDNESDAY,
        DayOfWeek.THURSDAY,
        DayOfWeek.FRIDAY
    );


    @Column(name = "is_approved", nullable = false)
    private Boolean isApproved = false;

    @Column(name = "rating_average", precision = 3, scale = 2)
    private BigDecimal ratingAverage = BigDecimal.ZERO;

    @Column(name = "total_reviews")
    private Integer totalReviews = 0;

}
	
