package com.salon.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.salon.entities.Owner;

public interface OwnerRepository extends JpaRepository<Owner, Integer> {
    
    @Query("SELECT o FROM Owner o JOIN FETCH o.user")
    List<Owner> findAllWithUser();
    
    Optional<Owner> findByUser_UserId(Integer userId);
}
