package com.salon.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.salon.entities.Salon;
import com.salon.entities.Service;

public interface SalonRepository extends JpaRepository<Salon, Long> {
///get all slaonss
    @Query(
        value = """
            SELECT DISTINCT s
            FROM Salon s
            LEFT JOIN FETCH s.workingDays wd
            WHERE s.isApproved = true
              AND (:search IS NULL 
                   OR LOWER(s.city) LIKE LOWER(CONCAT('%', :search, '%'))
                   OR LOWER(s.salonName) LIKE LOWER(CONCAT('%', :search, '%')))
              AND (:state IS NULL 
                   OR LOWER(s.state) LIKE LOWER(CONCAT('%', :state, '%')))
        """,
        countQuery = """
            SELECT COUNT(s)
            FROM Salon s
            WHERE s.isApproved = true
              AND (:search IS NULL 
                   OR LOWER(s.city) LIKE LOWER(CONCAT('%', :search, '%'))
                   OR LOWER(s.salonName) LIKE LOWER(CONCAT('%', :search, '%')))
              AND (:state IS NULL 
                   OR LOWER(s.state) LIKE LOWER(CONCAT('%', :state, '%')))
        """
    )
    Page<Salon> searchApprovedSalons(
            @Param("search") String search,
            @Param("state") String state,
            Pageable pageable
    );
    
    
    /////get each salon by id
    @Query("""
            SELECT s FROM Salon s
            LEFT JOIN FETCH s.serviceCategories
            WHERE s.salonId = :salonId
            """)
     Optional<Salon> findSalonWithCategories(@Param("salonId") Long salonId);

    

}
