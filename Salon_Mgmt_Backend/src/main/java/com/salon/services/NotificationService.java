//package com.salon.services;
//
//import java.time.LocalDateTime;
//
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.Pageable;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import com.salon.dtos.NotificationCreateDTO;
//import com.salon.dtos.NotificationResponseDTO;
//import com.salon.entities.Notification;
//import com.salon.entities.User;
//import com.salon.exception.ResourceNotFoundException;
//import com.salon.repository.NotificationRepository;
//import com.salon.repository.UserRepository;
//
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//
//@Service
//@RequiredArgsConstructor
//@Slf4j
//public class NotificationService {
//    private final NotificationRepository notificationRepository;
//    private final UserRepository userRepository;
//
//    @Transactional(readOnly = true)
//    public Page<NotificationResponseDTO> getUserNotifications(Integer userId, Pageable pageable) {
//        log.info("Fetching notifications for user: {}", userId);
//
//        Page<Notification> notifications = notificationRepository
//                .findByUser_UserIdOrderByCreatedAtDesc(userId, pageable);
//
//        return notifications.map(this::mapToResponseDTO);
//    }
//
//    @Transactional(readOnly = true)
//    public Page<NotificationResponseDTO> getUnreadNotifications(Integer userId, Pageable pageable) {
//        log.info("Fetching unread notifications for user: {}", userId);
//
//        Page<Notification> notifications = notificationRepository
//                .findByUser_UserIdAndIsReadFalseOrderByCreatedAtDesc(userId, pageable);
//
//        return notifications.map(this::mapToResponseDTO);
//    }
//
//    @Transactional(readOnly = true)
//    public Long getUnreadCount(Integer userId) {
//        return notificationRepository.countByUser_UserIdAndIsReadFalse(userId);
//    }
//
//    @Transactional
//    public NotificationResponseDTO markAsRead(Integer notificationId, Integer userId) {
//        log.info("Marking notification as read: {} for user: {}", notificationId, userId);
//
//        Notification notification = notificationRepository
//                .findByNotificationIdAndUserId(notificationId, userId)
//                .orElseThrow(() -> new ResourceNotFoundException("Notification not found or does not belong to user"));
//
//        if (!notification.getIsRead()) {
//            notification.setIsRead(true);
//            notification.setReadAt(LocalDateTime.now());
//            notification = notificationRepository.save(notification);
//        }
//
//        return mapToResponseDTO(notification);
//    }
//
//    @Transactional
//    public void markAllAsRead(Integer userId) {
//        log.info("Marking all notifications as read for user: {}", userId);
//        notificationRepository.markAllAsReadByUserId(userId);
//    }
//
//    @Transactional
//    public NotificationResponseDTO createNotification(NotificationCreateDTO createDTO) {
//        log.info("Creating notification for user: {}", createDTO.getUserId());
//
//        User user = userRepository.findById(createDTO.getUserId())
//                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
//
//        Notification notification = new Notification();
//        notification.setUser(user);
//        notification.setTitle(createDTO.getTitle());
//        notification.setMessage(createDTO.getMessage());
//        notification.setType(createDTO.getType());
//        notification.setMetadata(createDTO.getMetadata());
//        notification.setIsRead(false);
//
//        Notification savedNotification = notificationRepository.save(notification);
//        return mapToResponseDTO(savedNotification);
//    }
//
//    @Transactional
//    public void sendBookingConfirmationNotification(Integer userId, String bookingNumber) {
//        NotificationCreateDTO notification = new NotificationCreateDTO();
//        notification.setUserId(userId);
//        notification.setTitle("Booking Confirmed");
//        notification.setMessage("Your booking " + bookingNumber + " has been confirmed!");
//        notification.setType(Notification.NotificationType.INFO);
//        createNotification(notification);
//    }
//
//    @Transactional
//    public void sendBookingCancellationNotification(Integer userId, String bookingNumber) {
//        NotificationCreateDTO notification = new NotificationCreateDTO();
//        notification.setUserId(userId);
//        notification.setTitle("Booking Cancelled");
//        notification.setMessage("Your booking " + bookingNumber + " has been cancelled.");
//        notification.setType(Notification.NotificationType.ALERT);
//        createNotification(notification);
//    }
//
//    @Transactional
//    public void sendPromotionNotification(Integer userId, String title, String message) {
//        NotificationCreateDTO notification = new NotificationCreateDTO();
//        notification.setUserId(userId);
//        notification.setTitle(title);
//        notification.setMessage(message);
//        notification.setType(Notification.NotificationType.PROMOTION);
//        createNotification(notification);
//    }
//
//    @Transactional
//    public void deleteNotification(Integer notificationId, Integer userId) {
//        log.info("Deleting notification: {} for user: {}", notificationId, userId);
//
//        Notification notification = notificationRepository
//                .findByNotificationIdAndUserId(notificationId, userId)
//                .orElseThrow(() -> new ResourceNotFoundException("Notification not found or does not belong to user"));
//
//        notificationRepository.delete(notification);
//    }
//
//    private NotificationResponseDTO mapToResponseDTO(Notification notification) {
//        return NotificationResponseDTO.builder()
//                .notificationId(notification.getNotificationId())
//                .title(notification.getTitle())
//                .message(notification.getMessage())
//                .type(notification.getType())
//                .isRead(notification.getIsRead())
//                .metadata(notification.getMetadata())
//                .createdAt(notification.getCreatedAt())
//                .readAt(notification.getReadAt())
//                .build();
//    }
//}
