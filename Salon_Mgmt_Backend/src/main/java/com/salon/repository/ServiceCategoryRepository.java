package com.salon.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.salon.entities.Salon;
import com.salon.entities.ServiceCategory;

public interface ServiceCategoryRepository extends JpaRepository<ServiceCategory, Integer> {
    
    List<ServiceCategory> findBySalonAndIsActiveTrue(Salon salon);
}
