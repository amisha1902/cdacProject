package com.salon.repository;

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
    Optional<Review> findByBooking_BookingId(Integer bookingId);

    // Find reviews by customer (through booking)
    Page<Review> findByBooking_Customer_CustomerId(Integer customerId, Pageable pageable);

    // Find reviews by salon (through booking)
    Page<Review> findByBooking_Salon_SalonId(Integer salonId, Pageable pageable);

    // Find reviews by staff (through booking)
    Page<Review> findByBooking_Staff_StaffId(Integer staffId, Pageable pageable);

    // Find reviews by rating for a salon (through booking)
    Page<Review> findByBooking_Salon_SalonIdAndRating(Integer salonId, Integer rating, Pageable pageable);

    // Find verified reviews for a salon (through booking)
    Page<Review> findByBooking_Salon_SalonIdAndIsVerified(Integer salonId, Boolean isVerified, Pageable pageable);

    // Check if customer has already reviewed a booking
    boolean existsByBooking_BookingId(Integer bookingId);

    // Get average rating for salon (through booking)
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.booking.salon.salonId = :salonId")
    Double getAverageRatingBySalon(@Param("salonId") Integer salonId);

    // Get total reviews count for salon (through booking)
    @Query("SELECT COUNT(r) FROM Review r WHERE r.booking.salon.salonId = :salonId")
    Long countBySalonId(@Param("salonId") Integer salonId);

    // Find all reviews (for admin)
    Page<Review> findAllByOrderByCreatedAtDesc(Pageable pageable);

    // Find reviews by customer and check ownership (through booking)
    @Query("SELECT r FROM Review r WHERE r.reviewId = :reviewId AND r.booking.customer.customerId = :customerId")
    Optional<Review> findByReviewIdAndCustomerId(@Param("reviewId") Integer reviewId,
            @Param("customerId") Integer customerId);

}
