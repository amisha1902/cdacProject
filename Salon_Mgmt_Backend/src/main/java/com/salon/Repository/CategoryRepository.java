package com.salon.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.salon.entities.ServiceCategory;

public interface CategoryRepository extends JpaRepository<ServiceCategory, Integer> {

}
