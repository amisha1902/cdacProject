//package com.salon.controllers;
//import com.salon.dtos.NotificationCreateDTO;
//
//import java.util.HashMap;
//import java.util.Map;
//
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.PageRequest;
//import org.springframework.data.domain.Pageable;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.core.Authentication;
//import org.springframework.web.bind.annotation.DeleteMapping;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PathVariable;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.PutMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestParam;
//import org.springframework.web.bind.annotation.RestController;
//
//import com.salon.dtos.NotificationResponseDTO;
//import com.salon.services.NotificationService;
//
//// import io.swagger.v3.oas.annotations.Operation;
//// import io.swagger.v3.oas.annotations.security.SecurityRequirement;
//// import io.swagger.v3.oas.annotations.tags.Tag;
//import lombok.RequiredArgsConstructor;
//
//
//@RestController
//@RequestMapping("/api/notifications")
//@RequiredArgsConstructor
//// @Tag(name = "Notifications", description = "User notification management
//// APIs")
//// @SecurityRequirement(name = "Bearer Authentication")
//public class NotificationController {
//
//	private final NotificationService notificationService;
//
//	@GetMapping
//	// @Operation(summary = "View notifications", description = "Get all
//	// notifications for the authenticated user")
//	public ResponseEntity<Map<String, Object>> getNotifications(
//			@RequestParam(defaultValue = "0") int page,
//			@RequestParam(defaultValue = "20") int size,
//			@RequestParam(required = false) Boolean unreadOnly,
//			Authentication authentication) {
//
//		Integer userId = extractUserIdFromAuth(authentication);
//
//		Pageable pageable = PageRequest.of(page, size);
//		Page<NotificationResponseDTO> notifications;
//
//		if (Boolean.TRUE.equals(unreadOnly)) {
//			notifications = notificationService.getUnreadNotifications(userId, pageable);
//		} else {
//			notifications = notificationService.getUserNotifications(userId, pageable);
//		}
//
//		Long unreadCount = notificationService.getUnreadCount(userId);
//
//		Map<String, Object> response = new HashMap<>();
//		response.put("success", true);
//		response.put("data", notifications.getContent());
//		response.put("currentPage", notifications.getNumber());
//		response.put("totalItems", notifications.getTotalElements());
//		response.put("totalPages", notifications.getTotalPages());
//		response.put("unreadCount", unreadCount);
//
//		return ResponseEntity.ok(response);
//	}
//
//	@PostMapping
//	public ResponseEntity<Map<String, Object>> createNotification(
//	        @RequestBody NotificationCreateDTO createDTO) {
//
//	    NotificationResponseDTO notification =
//	            notificationService.createNotification(createDTO);
//
//	    Map<String, Object> response = new HashMap<>();
//	    response.put("success", true);
//	    response.put("message", "Notification created successfully");
//	    response.put("data", notification);
//
//	    return ResponseEntity.ok(response);
//	}
//
//	@PutMapping("/{notificationId}/read")
//	// @Operation(summary = "Mark notification as read", description = "Mark a
//	// specific notification as read")
//	public ResponseEntity<Map<String, Object>> markAsRead(
//			@PathVariable Integer notificationId,
//			Authentication authentication) {
//
//		Integer userId = extractUserIdFromAuth(authentication);
//
//		NotificationResponseDTO notification = notificationService.markAsRead(notificationId, userId);
//
//		Map<String, Object> response = new HashMap<>();
//		response.put("success", true);
//		response.put("message", "Notification marked as read");
//		response.put("data", notification);
//
//		return ResponseEntity.ok(response);
//	}
//
//	@PutMapping("/read-all")
//	// @Operation(summary = "Mark all as read", description = "Mark all
//	// notifications as read for the user")
//	public ResponseEntity<Map<String, Object>> markAllAsRead(Authentication authentication) {
//
//		Integer userId = extractUserIdFromAuth(authentication);
//
//		notificationService.markAllAsRead(userId);
//
//		Map<String, Object> response = new HashMap<>();
//		response.put("success", true);
//		response.put("message", "All notifications marked as read");
//
//		return ResponseEntity.ok(response);
//	}
//
//	@GetMapping("/unread-count")
//	// @Operation(summary = "Get unread count", description = "Get count of unread
//	// notifications")
//	public ResponseEntity<Map<String, Object>> getUnreadCount(Authentication authentication) {
//
//		Integer userId = extractUserIdFromAuth(authentication);
//
//		Long unreadCount = notificationService.getUnreadCount(userId);
//
//		Map<String, Object> response = new HashMap<>();
//		response.put("success", true);
//		response.put("unreadCount", unreadCount);
//
//		return ResponseEntity.ok(response);
//	}
//
//	@DeleteMapping("/{notificationId}")
//	// @Operation(summary = "Delete notification", description = "Delete a specific
//	// notification")
//	public ResponseEntity<Map<String, Object>> deleteNotification(
//			@PathVariable Integer notificationId,
//			Authentication authentication) {
//
//		Integer userId = extractUserIdFromAuth(authentication);
//
//		notificationService.deleteNotification(notificationId, userId);
//
//		Map<String, Object> response = new HashMap<>();
//		response.put("success", true);
//		response.put("message", "Notification deleted successfully");
//
//		return ResponseEntity.ok(response);
//	}
//
//	// Helper method to extract user ID from authentication
//	private Integer extractUserIdFromAuth(Authentication authentication) {
//		// This would be implemented based on your JWT/Security implementation
//		// For now, returning a placeholder
//		// In real implementation: extract user ID from JWT token
//		return 1; // Replace with actual implementation
//	}
//
//}
