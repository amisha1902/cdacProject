package com.salon.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.salon.entities.ServiceCategory;

public interface ServiceCategoryRepository extends JpaRepository<ServiceCategory, Integer> {

}
