package com.salon.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.salon.entities.Owner;

public interface OwnerRepository extends JpaRepository<Owner, Integer> {
    
    @Query("SELECT o FROM Owner o JOIN FETCH o.user")
    List<Owner> findAllWithUser();
}
