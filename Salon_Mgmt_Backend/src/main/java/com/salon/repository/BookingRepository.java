package com.salon.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.salon.entities.Booking;
import com.salon.entities.Owner;

public interface BookingRepository extends JpaRepository<Booking, Long> {
	List<Booking> findByCustomerIdOrderByBookingIdDesc(Integer customerId);
    List<Booking> findBySalon_SalonId(Long salonId);
    
    @Query("""
        SELECT b FROM Booking b
        JOIN FETCH b.salon s
        JOIN FETCH b.services bs
        JOIN FETCH bs.service srv
        JOIN FETCH srv.category cat
        WHERE s.owner = :owner
        ORDER BY b.bookingDate DESC
    """)
    List<Booking> findByOwnerWithDetails(@Param("owner") Owner owner);
}
  