package com.salon.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.salon.entities.Owner;

@Repository
public interface OwnerRepository extends JpaRepository<Owner, Integer> {

	
}
