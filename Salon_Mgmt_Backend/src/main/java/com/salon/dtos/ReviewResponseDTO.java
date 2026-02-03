package com.salon.dtos;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponseDTO {

    private Integer reviewId;
    private Integer customerId;
    private String customerName;
    private String customerProfileImage;
    private Integer salonId;
    private String salonName;
    private Integer bookingId;
    private String bookingNumber;
    private Integer staffId;
    private String staffName;
    private Integer rating;
    private String comment;
    private List<String> images;
    private List<ReviewReplyDTO> replies;
    private Boolean isVerified;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
