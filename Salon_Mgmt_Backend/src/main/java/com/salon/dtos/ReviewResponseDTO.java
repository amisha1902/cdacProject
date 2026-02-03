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
    private String customerName;
    private Long bookingId;
    private Integer rating;
    private String comment;
    private List<String> images;
    private LocalDateTime createdAt;
    private Boolean isVerified;
}
