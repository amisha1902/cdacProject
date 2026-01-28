package com.salon.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.salon.entities.Service;

public interface ServiceRepository extends JpaRepository<Service, Integer> {

}
