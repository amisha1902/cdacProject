package com.salon.entities;

import java.math.BigDecimal;
import java.util.List;

import jakarta.persistence.*;
import lombok.*;

@Entity
	@Table(name = "service")
	@Getter
	@Setter
	@NoArgsConstructor
	@AllArgsConstructor
	@Builder
	public class Service extends BaseEntity {

	    @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    @Column(name = "service_id")
	    private Integer serviceId;

	    @ManyToOne(fetch = FetchType.LAZY, optional = false)
	    @JoinColumn(name = "salon_id", nullable = false)
	    private Salon salon;

	    @ManyToOne(fetch = FetchType.LAZY, optional = false) //to prevent unnecessary joins
	    @JoinColumn(name = "category_id", nullable = false)
	    private ServiceCategory category;

	    @Column(name = "service_name", nullable = false, length = 255)
	    private String serviceName;

	    @Column(columnDefinition = "TEXT")
	    private String description;

	    @Column(name = "base_price", nullable = false)
	    private BigDecimal basePrice;

	    @Column(name = "duration_minutes", nullable = false)
	    private Integer durationMinutes;

	    @Builder.Default
	    @Column(name = "is_available")
	    private Boolean isAvailable = true;

	    @Column(length = 255)
	    private String image;
	    
	    @OneToMany(mappedBy = "service", fetch = FetchType.LAZY)
	    private List<AvailabilitySlot> availabilitySlots;

	    

	}

