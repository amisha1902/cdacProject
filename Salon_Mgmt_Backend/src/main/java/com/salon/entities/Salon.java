package com.salon.entities;

import java.time.LocalDateTime;
import java.time.LocalTime;

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
   private Long salonId;
	@Column(name="owner_id")
   private Long ownerId;
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
   
   private Boolean isApproved;
   
   private Double ratingAverage;
   
   private Integer totalReviews;
   
   private LocalDateTime createdAt;
   private LocalDateTime updatedAt;
    
}
