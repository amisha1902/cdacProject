package com.salon.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AdminReviewResponseDTO {
	 @NotBlank(message = "Admin response is required")
	    @Size(max = 500, message = "Response must not exceed 500 characters")
	    private String adminResponse;
}
