package com.salon.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "service_category")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ServiceCategory extends BaseEntity{

	
	 @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    @Column(name = "category_id")
	    private Integer categoryId;

	    @Column(name = "category_name", nullable = false, length = 100)
	    private String categoryName;

	    @Column(columnDefinition = "TEXT")
	    private String description;

	    @Builder.Default
	    @Column(name = "is_active")
	    private Boolean isActive = true;
}
