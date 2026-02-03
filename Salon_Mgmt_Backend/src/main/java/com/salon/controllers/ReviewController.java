package com.salon.controllers;

import java.util.HashMap;
import java.util.Map;

import org.springframework.security.core.Authentication;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.salon.dtos.ReviewRequestDTO;
import com.salon.dtos.ReviewResponseDTO;
import com.salon.dtos.ReviewUpdateDTO;
import com.salon.services.ReviewService;

// import io.swagger.v3.oas.annotations.Operation;
// import io.swagger.v3.oas.annotations.security.SecurityRequirement;
// import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
// @Tag(name = "Reviews (Customer)", description = "Customer review management
// APIs")
public class ReviewController {

        private final ReviewService reviewService;

        @PostMapping
        // @Operation(summary = "Add a new review", description = "Customer can add
        // review for a completed booking")
        public ResponseEntity<Map<String, Object>> addReview(
                        @Valid @RequestBody ReviewRequestDTO requestDTO) {

                // Extract customer ID (For testing without security)
                Integer customerId = 1;

                ReviewResponseDTO review = reviewService.createReview(requestDTO, customerId);

                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Review added successfully");
                response.put("data", review);

                return ResponseEntity.status(HttpStatus.CREATED).body(response);
        }

        @PutMapping("/{reviewId}")
        // @Operation(summary = "Edit a review", description = "Customer can edit their
        // own review")
        public ResponseEntity<Map<String, Object>> editReview(
                        @PathVariable Integer reviewId,
                        @Valid @RequestBody ReviewUpdateDTO updateDTO) {

                Integer customerId = 1;

                ReviewResponseDTO review = reviewService.updateReview(reviewId, updateDTO, customerId);

                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Review updated successfully");
                response.put("data", review);

                return ResponseEntity.ok(response);
        }

        @DeleteMapping("/{reviewId}")
        // @Operation(summary = "Delete a review", description = "Customer can delete
        // their own review")
        public ResponseEntity<Map<String, Object>> deleteReview(
                        @PathVariable Integer reviewId) {

                Integer customerId = 1;

                reviewService.deleteReview(reviewId, customerId);

                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Review deleted successfully");

                return ResponseEntity.ok(response);
        }

        @GetMapping("/me")
        // @Operation(summary = "View own reviews", description = "Customer can view all
        // their reviews")
        public ResponseEntity<Map<String, Object>> getMyReviews(
                        @RequestParam(defaultValue = "1") Integer customerId,
                        @RequestParam(defaultValue = "0") int page,
                        @RequestParam(defaultValue = "10") int size,
                        @RequestParam(defaultValue = "createdAt") String sortBy,
                        @RequestParam(defaultValue = "DESC") String sortDir) {

                try {
                        Sort sort = sortDir.equalsIgnoreCase("ASC") ? Sort.by(sortBy).ascending()
                                        : Sort.by(sortBy).descending();
                        Pageable pageable = PageRequest.of(page, size, sort);

                        Page<ReviewResponseDTO> reviews = reviewService.getMyReviews(customerId, pageable);

                        Map<String, Object> response = new HashMap<>();
                        response.put("success", true);
                        response.put("data", reviews.getContent());
                        response.put("currentPage", reviews.getNumber());
                        response.put("totalItems", reviews.getTotalElements());
                        response.put("totalPages", reviews.getTotalPages());

                        return ResponseEntity.ok(response);
                } catch (Exception e) {
                        e.printStackTrace();
                        Map<String, Object> errorResponse = new HashMap<>();
                        errorResponse.put("success", false);
                        errorResponse.put("error", e.getMessage());
                        errorResponse.put("trace", e.getStackTrace()[0].toString());
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
                }
        }

        @GetMapping("/salon/{salonId}")
        // @Operation(summary = "View salon reviews", description = "Get all reviews for
        // a specific salon")
        public ResponseEntity<Map<String, Object>> getSalonReviews(
                        @PathVariable Integer salonId,
                        @RequestParam(defaultValue = "0") int page,
                        @RequestParam(defaultValue = "10") int size) {

                Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
                Page<ReviewResponseDTO> reviews = reviewService.getSalonReviews(salonId, pageable);

                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("data", reviews.getContent());
                response.put("currentPage", reviews.getNumber());
                response.put("totalItems", reviews.getTotalElements());
                response.put("totalPages", reviews.getTotalPages());

                return ResponseEntity.ok(response);
        }

}
