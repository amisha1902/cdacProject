package com.salon.entities;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "notification")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notification {
	 @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    @Column(name = "notification_id")
	    private Integer notificationId;
	    
	    @ManyToOne(fetch = FetchType.LAZY)
	    @JoinColumn(name = "user_id", nullable = false)
	    private User user;
	    
	    @Column(name = "title")
	    private String title;
	    
	    @Column(name = "message", columnDefinition = "TEXT")
	    private String message;
	    
	    @Enumerated(EnumType.STRING)
	    @Column(name = "type")
	    private NotificationType type;
	    
	    @Column(name = "is_read")
	    private Boolean isRead = false;
	    
	    @Column(name = "metadata", columnDefinition = "JSON")
	    private String metadata;
	    
	    @Column(name = "created_at", updatable = false)
	    private LocalDateTime createdAt;
	    
	    @Column(name = "read_at")
	    private LocalDateTime readAt;
	    
	    @PrePersist
	    protected void onCreate() {
	        createdAt = LocalDateTime.now();
	        if (isRead == null) {
	            isRead = false;
	        }
	    }
	    
	    public enum NotificationType {
	        INFO, ALERT, PROMOTION
	    }

}
