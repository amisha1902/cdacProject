package com.salon.services;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.salon.customException.ResourceNotFoundException;
import com.salon.dtos.ReviewRequestDTO;
import com.salon.dtos.ReviewResponseDTO;
import com.salon.entities.Booking;
import com.salon.entities.Review;
import com.salon.entities.Salon;
import com.salon.entities.enums.BookingStatus;
import com.salon.repository.BookingRepository;
import com.salon.repository.ReviewRepository;
import com.salon.repository.SalonRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReviewServiceImpl {

    private final ReviewRepository reviewRepository;
    private final BookingRepository bookingRepository;
    private final SalonRepository salonRepository;

    @Transactional
    public ReviewResponseDTO addReview(ReviewRequestDTO dto, Integer userId) {
        log.info("Starting addReview for bookingId: {}, rating: {}, userId: {}", dto.getBookingId(), dto.getRating(), userId);
        
        // Verify booking exists and belongs to user
        Booking booking = bookingRepository.findById(dto.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        
        log.info("Found booking: {}, status: {}, salonId: {}", booking.getBookingId(), booking.getStatus(), booking.getSalon().getSalonId());

        // Check if booking is completed or confirmed (payment done)
        if (booking.getStatus() != BookingStatus.COMPLETED && booking.getStatus() != BookingStatus.CONFIRMED) {
            log.error("Cannot review - booking status is: {}", booking.getStatus());
            throw new IllegalStateException("Can only review confirmed or completed bookings");
        }

        // Check if already reviewed
        boolean alreadyReviewed = reviewRepository.existsByBooking_BookingId(dto.getBookingId());
        log.info("Already reviewed check: {}", alreadyReviewed);
        if (alreadyReviewed) {
            throw new IllegalStateException("You have already reviewed this booking");
        }

        // Create review
        Review review = new Review();
        review.setBooking(booking);
        review.setRating(dto.getRating());
        review.setComment(dto.getComment());
        review.setIsVerified(false);
        review.setCreatedAt(LocalDateTime.now());
        review.setUpdatedAt(LocalDateTime.now());

        log.info("Saving review to database...");
        review = reviewRepository.save(review);
        log.info("Review saved successfully with ID: {}", review.getReviewId());

        // Update salon rating and review count
        Long salonId = booking.getSalon().getSalonId();
        log.info("Updating salon rating for salonId: {}", salonId);
        updateSalonRating(salonId);

        return mapToResponse(review);
    }

    private void updateSalonRating(Long salonId) {
        log.info("Updating rating for salon ID: {}", salonId);
        
        Salon salon = salonRepository.findById(salonId)
                .orElseThrow(() -> new ResourceNotFoundException("Salon not found"));
        
        // Get updated average and count
        Double avgRating = reviewRepository.getAverageRatingBySalon(salonId);
        Long totalReviews = reviewRepository.getTotalReviewsBySalon(salonId);
        
        log.info("Calculated avgRating: {}, totalReviews: {}", avgRating, totalReviews);
        
        // Update salon - convert Double to BigDecimal
        if (avgRating != null && avgRating > 0) {
            salon.setRatingAverage(BigDecimal.valueOf(avgRating).setScale(1, RoundingMode.HALF_UP));
        } else {
            salon.setRatingAverage(BigDecimal.ZERO);
        }
        salon.setTotalReviews(totalReviews != null ? totalReviews.intValue() : 0);
        
        log.info("Updated salon rating to: {}, totalReviews: {}", salon.getRatingAverage(), salon.getTotalReviews());
        
        salonRepository.save(salon);
    }

    @Transactional(readOnly = true)
    public List<ReviewResponseDTO> getReviewsBySalon(Long salonId) {
        log.info("Service: Getting reviews for salon {}", salonId);
        try {
            List<Review> reviews = reviewRepository.findBySalonId(salonId);
            log.info("Service: Found {} reviews from repository", reviews != null ? reviews.size() : 0);
            
            if (reviews == null) {
                log.warn("Repository returned null for salon {}", salonId);
                return List.of();
            }
            
            return reviews.stream()
                    .map(this::mapToResponse)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error getting reviews for salon {}: {}", salonId, e.getMessage(), e);
            throw e;
        }
    }

    @Transactional(readOnly = true)
    public Double getAverageRatingBySalon(Long salonId) {
        log.info("Service: Getting average rating for salon {}", salonId);
        try {
            Double avg = reviewRepository.getAverageRatingBySalon(salonId);
            Double result = avg != null ? Math.round(avg * 10.0) / 10.0 : 0.0;
            log.info("Service: Average rating for salon {} is {}", salonId, result);
            return result;
        } catch (Exception e) {
            log.error("Error getting average rating for salon {}: {}", salonId, e.getMessage(), e);
            throw e;
        }
    }

    private ReviewResponseDTO mapToResponse(Review review) {
        ReviewResponseDTO dto = new ReviewResponseDTO();
        dto.setReviewId(review.getReviewId());
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());
        dto.setCreatedAt(review.getCreatedAt());
        dto.setIsVerified(review.getIsVerified());
        
        // Get customer name from booking if available
        if (review.getBooking() != null) {
            dto.setBookingId(review.getBooking().getBookingId());
            // For now using generic name, can be enhanced to fetch actual customer name
            dto.setCustomerName("Customer #" + review.getBooking().getCustomerId());
        } else {
            dto.setCustomerName("Anonymous");
        }
        
        return dto;
    }
}
