package com.salon.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.salon.entities.Salon;

public interface SalonRepository extends JpaRepository<Salon, Long> {

}
