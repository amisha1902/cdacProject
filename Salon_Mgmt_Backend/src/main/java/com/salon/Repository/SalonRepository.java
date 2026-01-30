package com.salon.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.salon.entities.Salon;

@Repository
public interface SalonRepository extends JpaRepository<Salon,Long> {

	List<Salon> findByIsApproved(Integer status);
}
