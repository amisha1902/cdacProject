package com.salon.entities;

import java.time.LocalDateTime;

import jakarta.persistence.GenerationType;
import lombok.Data;
import jakarta.persistence.*;


@Entity
@Table(name="service_category")
@Data
public class ServiceCategory {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="category_id")
	private Integer categoryId;
	
	@Column(name="category_name")
	private String categoryName;
	
	private String description;
	
	@Column(columnDefinition = "TINYINT(1)",name="is_active")
	private Boolean isActive = true;
	
	@Column(name="created_at")
	private LocalDateTime createdAt = LocalDateTime.now();
}
