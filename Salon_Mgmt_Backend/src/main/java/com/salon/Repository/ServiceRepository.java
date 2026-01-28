package com.salon.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;


import com.salon.entities.Services;

public interface ServiceRepository extends JpaRepository<Services, Integer> {
    List<Services> findBySalonId(Integer salonId);
}
