package com.salon.controllers;

import java.util.HashMap;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.salon.dtos.ReviewResponseDTO;
import com.salon.services.ReviewService;

// import io.swagger.v3.oas.annotations.Operation;
// import io.swagger.v3.oas.annotations.security.SecurityRequirement;
// import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/reviews")
@RequiredArgsConstructor
// @Tag(name = "Reviews (Admin)", description = "Admin review management APIs")
public class AdminReviewController {

    private final ReviewService reviewService;

    @GetMapping
    // @Operation(summary = "View all reviews", description = "Admin can view all
    // reviews in the system")
    public ResponseEntity<Map<String, Object>> getAllReviews(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("ASC") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<ReviewResponseDTO> reviews = reviewService.getAllReviews(pageable);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", reviews.getContent());
        response.put("currentPage", reviews.getNumber());
        response.put("totalItems", reviews.getTotalElements());
        response.put("totalPages", reviews.getTotalPages());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/{reviewId}/response")
    // @Operation(summary = "Respond to review", description = "Admin can respond to
    // customer reviews")
    public ResponseEntity<Map<String, Object>> respondToReview(
            @PathVariable Integer reviewId,
            @RequestBody Map<String, String> request) {

        String adminResponse = request.get("response");

        // Extract Admin User ID (Placeholder logic, replace with actual)
        // For now using ID 1 (Owner)
        Integer adminUserId = 1;

        com.salon.dtos.ReviewReplyDTO replyDTO = reviewService.addReply(reviewId, adminResponse, adminUserId);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Admin response added successfully");
        response.put("data", replyDTO);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{reviewId}/verify")
    // @Operation(summary = "Verify review", description = "Admin can verify
    // legitimate reviews")
    public ResponseEntity<Map<String, Object>> verifyReview(@PathVariable Integer reviewId) {

        // Implementation would update the is_verified flag
        // This is a placeholder implementation

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Review verified successfully");
        response.put("reviewId", reviewId);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{reviewId}")
    // @Operation(summary = "Delete review", description = "Admin can delete
    // inappropriate reviews")
    public ResponseEntity<Map<String, Object>> deleteReview(@PathVariable Integer reviewId) {

        // Implementation would delete the review
        // Note: This is different from customer delete as admin can delete any review

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Review deleted successfully");

        return ResponseEntity.ok(response);
    }

    @GetMapping("/salon/{salonId}")
    // @Operation(summary = "View salon reviews", description = "Admin can view all
    // reviews for a specific salon")
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

    @GetMapping("/stats")
    // @Operation(summary = "Get review statistics", description = "Admin can view
    // overall review statistics")
    public ResponseEntity<Map<String, Object>> getReviewStats() {

        // Implementation would calculate various statistics
        // This is a placeholder showing what data you might return

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalReviews", 150);
        stats.put("averageRating", 4.2);
        stats.put("verifiedReviews", 120);
        stats.put("pendingVerification", 30);
        stats.put("ratingDistribution", Map.of(
                "5star", 80,
                "4star", 40,
                "3star", 20,
                "2star", 7,
                "1star", 3));

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", stats);

        return ResponseEntity.ok(response);
    }

}
