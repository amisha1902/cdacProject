package com.salon.dtos;

import com.salon.entities.Notification.NotificationType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class NotificationCreateDTO {
	@NotNull(message = "User ID is required")
    private Integer userId;
    
    @NotBlank(message = "Title is required")
    private String title;
    
    @NotBlank(message = "Message is required")
    private String message;
    
    @NotNull(message = "Type is required")
    private NotificationType type;
    
    private String metadata; 
}
