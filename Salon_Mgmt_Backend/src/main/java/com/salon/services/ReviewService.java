package com.salon.services;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.salon.dtos.ReviewRequestDTO;
import com.salon.dtos.ReviewResponseDTO;
import com.salon.dtos.ReviewUpdateDTO;
import com.salon.entities.Booking;
import com.salon.entities.Review;
import com.salon.exception.BadRequestException;
import com.salon.exception.ResourceNotFoundException;
import com.salon.repository.BookingRepository;
import com.salon.repository.ReviewRepository;
import com.salon.repository.ReviewReplyRepository;
import com.salon.repository.UserRepository;
import com.salon.entities.ReviewReply;
import com.salon.entities.User;
import com.salon.dtos.ReviewReplyDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final BookingRepository bookingRepository;
    private final ObjectMapper objectMapper;

    @Transactional
    public ReviewResponseDTO createReview(ReviewRequestDTO requestDTO, Integer customerId) {
        log.info("Creating review for customer: {}, booking: {}", customerId, requestDTO.getBookingId());

        // Validate booking exists and belongs to customer
        Booking booking = bookingRepository.findById(requestDTO.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        // Verify booking belongs to the customer
//        if (!booking.getCustomer().getCustomerId().equals(customerId)) {
//            throw new BadRequestException("Booking does not belong to this customer");
//        }

        // Check if booking is completed
//        if (!booking.getStatus().equals(Booking.BookingStatus.COMPLETED)) {
//            throw new BadRequestException("Cannot review a booking that is not completed");
//        }

        // Check if review already exists for this booking
//        if (reviewRepository.existsByBooking_BookingId(requestDTO.getBookingId())) {
//            throw new BadRequestException("Review already exists for this booking");
//        }

        // Create review - all relationships come from booking
        Review review = new Review();
        review.setBooking(booking);
        review.setRating(requestDTO.getRating());
        review.setComment(requestDTO.getComment());
        review.setIsVerified(false);

        // Convert images list to JSON string
        if (requestDTO.getImages() != null && !requestDTO.getImages().isEmpty()) {
            try {
                review.setImages(objectMapper.writeValueAsString(requestDTO.getImages()));
            } catch (JsonProcessingException e) {
                log.error("Error converting images to JSON", e);
            }
        }

        Review savedReview = reviewRepository.save(review);

        log.info("Review created successfully with ID: {}", savedReview.getReviewId());
        return mapToResponseDTO(savedReview);
    }

    @Transactional
    public ReviewResponseDTO updateReview(Integer reviewId, ReviewUpdateDTO updateDTO, Integer customerId) {
        log.info("Updating review: {} for customer: {}", reviewId, customerId);

        Review review = reviewRepository.findByReviewIdAndCustomerId(reviewId, customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found or does not belong to customer"));

        review.setRating(updateDTO.getRating());
        review.setComment(updateDTO.getComment());

        if (updateDTO.getImages() != null) {
            try {
                review.setImages(objectMapper.writeValueAsString(updateDTO.getImages()));
            } catch (JsonProcessingException e) {
                log.error("Error converting images to JSON", e);
            }
        }

        Review updatedReview = reviewRepository.save(review);

        return mapToResponseDTO(updatedReview);
    }

    @Transactional
    public void deleteReview(Integer reviewId, Integer customerId) {
        log.info("Deleting review: {} for customer: {}", reviewId, customerId);

        Review review = reviewRepository.findByReviewIdAndCustomerId(reviewId, customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found or does not belong to customer"));

        reviewRepository.delete(review);
    }

    @Transactional(readOnly = true)
    public Page<ReviewResponseDTO> getMyReviews(Integer customerId, Pageable pageable) {
        log.info("Fetching reviews for customer: {}", customerId);

        Page<Review> reviews = reviewRepository.findByBooking_Customer_CustomerId(customerId, pageable);
        return reviews.map(this::mapToResponseDTO);
    }

    @Transactional(readOnly = true)
    public Page<ReviewResponseDTO> getAllReviews(Pageable pageable) {
        log.info("Fetching all reviews (Admin)");

        Page<Review> reviews = reviewRepository.findAllByOrderByCreatedAtDesc(pageable);
        return reviews.map(this::mapToResponseDTO);
    }

    @Transactional(readOnly = true)
    public Page<ReviewResponseDTO> getSalonReviews(Integer salonId, Pageable pageable) {
        Page<Review> reviews = reviewRepository.findByBooking_Salon_SalonId(salonId, pageable);
        return reviews.map(this::mapToResponseDTO);
    }

    // Removed updateSalonRating method - this should be handled by Salon service
    // to maintain independence between modules

    private final ReviewReplyRepository reviewReplyRepository;
    private final UserRepository userRepository;

    @Transactional
    public ReviewReplyDTO addReply(Integer reviewId, String replyText, Integer userId) {
        log.info("Adding reply to review: {} by user: {}", reviewId, userId);

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        ReviewReply reply = new ReviewReply();
        reply.setReview(review);
        reply.setUser(user);
        reply.setReply(replyText);

        ReviewReply savedReply = reviewReplyRepository.save(reply);

        return mapToReplyDTO(savedReply);
    }

    private ReviewReplyDTO mapToReplyDTO(ReviewReply reply) {
        return ReviewReplyDTO.builder()
                .replyId(reply.getReplyId())
                .reviewId(reply.getReview().getReviewId())
                .userId(reply.getUser().getUserId())
                .userName(reply.getUser().getFirstName() + " " + reply.getUser().getLastName())
                // .userRole() // Could fetch role if needed
                .reply(reply.getReply())
                .createdAt(reply.getCreatedAt())
                .build();
    }

    @SuppressWarnings("unchecked")
    private ReviewResponseDTO mapToResponseDTO(Review review) {
        List<String> imagesList = null;
        if (review.getImages() != null) {
            try {
                imagesList = objectMapper.readValue(review.getImages(), List.class);
            } catch (JsonProcessingException e) {
                log.error("Error parsing images JSON", e);
            }
        }

        List<ReviewReplyDTO> replyDTOs = null;
        if (review.getReplies() != null) {
            replyDTOs = review.getReplies().stream()
                    .map(this::mapToReplyDTO)
                    .collect(java.util.stream.Collectors.toList());
        }

        // Get data from booking relationship
        Booking booking = review.getBooking();

        return ReviewResponseDTO.builder()
                .reviewId(review.getReviewId())
                .customerId(booking.getCustomer().getCustomerId())
                .customerName(booking.getCustomer().getUser().getFirstName() + " " +
                        booking.getCustomer().getUser().getLastName())
                .customerProfileImage(booking.getCustomer().getUser().getProfileImage())
                .salonId(booking.getSalon().getSalonId())
                .salonName(booking.getSalon().getSalonName())
                .bookingId(booking.getBookingId())
                .bookingNumber(booking.getBookingNumber())
                .staffId(booking.getStaff().getStaffId())
                .staffName(booking.getStaff().getUser().getFirstName() + " " +
                        booking.getStaff().getUser().getLastName())
                .rating(review.getRating())
                .comment(review.getComment())
                .images(imagesList)
                .replies(replyDTOs)
                .isVerified(review.getIsVerified())
                .createdAt(review.getCreatedAt())
                .updatedAt(review.getUpdatedAt())
                .build();
    }
}
