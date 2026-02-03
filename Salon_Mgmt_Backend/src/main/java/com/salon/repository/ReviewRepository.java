package com.salon.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.salon.entities.Review;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Integer> {

    // Find review by booking ID
    Optional<Review> findByBooking_BookingId(Long bookingId);

    // Find reviews by salon
    @Query("SELECT r FROM Review r JOIN FETCH r.booking WHERE r.booking.salon.salonId = :salonId")
    List<Review> findBySalonId(@Param("salonId") Long salonId);

    // Check if customer has already reviewed a booking
    boolean existsByBooking_BookingId(Long bookingId);

    // Get average rating for salon
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.booking.salon.salonId = :salonId")
    Double getAverageRatingBySalon(@Param("salonId") Long salonId);

    // Get total reviews for salon
    @Query("SELECT COUNT(r) FROM Review r WHERE r.booking.salon.salonId = :salonId")
    Long getTotalReviewsBySalon(@Param("salonId") Long salonId);
}
//
//    // Get total reviews count for salon (through booking)
//    @Query("SELECT COUNT(r) FROM Review r WHERE r.booking.salon.salonId = :salonId")
//    Long countBySalonId(@Param("salonId") Integer salonId);
//
//    // Find all reviews (for admin)
//    Page<Review> findAllByOrderByCreatedAtDesc(Pageable pageable);
//
//    // Find reviews by customer and check ownership (through booking)
//    @Query("SELECT r FROM Review r WHERE r.reviewId = :reviewId AND r.booking.customer.customerId = :customerId")
//    Optional<Review> findByReviewIdAndCustomerId(@Param("reviewId") Integer reviewId,
//            @Param("customerId") Integer customerId);
//
//}
