package com.salon.entities;

import java.time.LocalDateTime;
import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Salon")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Salon {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "salon_id")
   private Long salonId;
	
	@ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    @JsonIgnore
    private Owner owner;
	
	@Column(name = "salon_name")
   private String salonName;
   private String address;
   private String city;
   private String state;
   private String pincode;
   private String phone;
   private String email;
   
   private String logo; //for image Url
   
   @Column(columnDefinition="JSON")  // it stores Json Array of URLS
   private String galleryImages;
   
   private LocalTime openingTime;
   private LocalTime closingTime;
   
   @Column(columnDefinition = "JSON")
   private String workingDays;
   
   @Column(name = "is_approved")
   private Integer isApproved;
   
   @Column(name="rating_average")
   private Double ratingAverage;
   
   
   @Column(name="total_reviews")
   private Integer totalReviews;
   
   @Column(name = "created_at")
   private LocalDateTime createdAt;
   
   @Column(name = "updated_at")
   private LocalDateTime updatedAt;
    
}
