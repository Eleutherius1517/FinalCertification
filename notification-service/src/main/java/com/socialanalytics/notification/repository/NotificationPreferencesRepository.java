package com.socialanalytics.notification.repository;

import com.socialanalytics.notification.model.NotificationPreferences;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationPreferencesRepository extends JpaRepository<NotificationPreferences, String> {
    
    /**
     * Находит все настройки уведомлений, где включены оповещения об активности
     */
    List<NotificationPreferences> findByActivityAlertsEnabledTrue();
    
    /**
     * Находит все настройки уведомлений, где включены оповещения о упоминаниях бренда
     */
    List<NotificationPreferences> findByBrandMentionsEnabledTrue();
    
    /**
     * Находит настройки уведомлений для конкретного пользователя
     */
    NotificationPreferences findByUserId(String userId);
} 