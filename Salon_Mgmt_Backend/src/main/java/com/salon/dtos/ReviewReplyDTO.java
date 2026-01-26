package com.salon.dtos;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewReplyDTO {
    private Integer replyId;
    private Integer reviewId;
    private Integer userId;
    private String userName; // To display who replied
    private String userRole; // Optional: "ADMIN", "CUSTOMER"
    private String reply;
    private LocalDateTime createdAt;
}
