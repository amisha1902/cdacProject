package com.salon.entities;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.persistence.Column;
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
@Table(name = "staff")
@Getter
@Setter
public class Staff {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="staff_id")
	private Integer staffId;
	
	@Column(name = "user_id", nullable = false)
	private Integer userId;
    @Column(name = "salon_id", nullable = false)
	private Integer salonId;
    @Column(name = "role_id", nullable = false)
	private Integer roleId;
    @Column(name = "hire_date")
	private LocalDate hireDate;
    @Column(name = "salary")
	private BigDecimal salary;
    @Enumerated(EnumType.STRING)
    @Column(name = "employment_type")
	private EmploymentType employmentType;
    @Column(name = "is_active")
	private Boolean isActive;
    
//    @ManyToOne
//    @JoinColumn(name = "salon_id")
//    private Salon salon;

}
