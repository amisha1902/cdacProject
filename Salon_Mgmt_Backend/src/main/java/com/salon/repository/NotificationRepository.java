//package com.salon.repository;
//
//import java.util.Optional;
//
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.Pageable;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Modifying;
//import org.springframework.data.jpa.repository.Query;
//import org.springframework.data.repository.query.Param;
//import org.springframework.stereotype.Repository;
//
//import com.salon.entities.Notification;
//
//@Repository
//public interface NotificationRepository extends JpaRepository<Notification, Integer> {
//
//    // Find all notifications for a user
//    Page<Notification> findByUser_UserIdOrderByCreatedAtDesc(Integer userId, Pageable pageable);
//
//    // Find unread notifications for a user
//    Page<Notification> findByUser_UserIdAndIsReadFalseOrderByCreatedAtDesc(Integer userId, Pageable pageable);
//
//    // Count unread notifications
//    Long countByUser_UserIdAndIsReadFalse(Integer userId);
//
//    // Find notification by ID and user ID (for ownership check)
//    @Query("SELECT n FROM Notification n WHERE n.notificationId = :notificationId AND n.user.userId = :userId")
//    Optional<Notification> findByNotificationIdAndUserId(@Param("notificationId") Integer notificationId,
//            @Param("userId") Integer userId);
//
//    // Mark all notifications as read for a user
//    @Modifying
//    @Query("UPDATE Notification n SET n.isRead = true, n.readAt = CURRENT_TIMESTAMP WHERE n.user.userId = :userId AND n.isRead = false")
//    void markAllAsReadByUserId(@Param("userId") Integer userId);
//
//    // Delete old read notifications (cleanup utility)
//    @Modifying
//    @Query("DELETE FROM Notification n WHERE n.user.userId = :userId AND n.isRead = true AND n.readAt < :cutoffDate")
//    void deleteOldReadNotifications(@Param("userId") Integer userId,
//            @Param("cutoffDate") java.time.LocalDateTime cutoffDate);
//
//}
