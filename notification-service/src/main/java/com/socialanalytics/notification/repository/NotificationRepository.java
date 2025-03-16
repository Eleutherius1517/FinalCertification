package com.socialanalytics.notification.repository;

import com.socialanalytics.notification.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, String> {
    
    /**
     * Находит все уведомления для конкретного пользователя
     */
    List<Notification> findByUserId(String userId);
    
    /**
     * Находит все уведомления, отправленные после указанной даты
     */
    List<Notification> findBySentAtAfter(LocalDateTime date);
    
    /**
     * Находит все непрочитанные уведомления пользователя
     */
    List<Notification> findByUserIdAndReadAtIsNull(String userId);
} 