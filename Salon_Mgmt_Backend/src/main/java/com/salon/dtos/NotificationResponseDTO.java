package com.salon.dtos;

import java.time.LocalDateTime;

import com.salon.entities.Notification.NotificationType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponseDTO {
	private Integer notificationId;
    private String title;
    private String message;
    private NotificationType type;
    private Boolean isRead;
    private String metadata;
    private LocalDateTime createdAt;
    private LocalDateTime readAt;
}
