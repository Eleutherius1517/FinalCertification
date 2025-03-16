package com.socialanalytics.notification.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Set;

@Data
@Entity
@Table(name = "notification_preferences")
public class NotificationPreferences {
    @Id
    private String id;
    
    private String userId;
    
    // Настройки оповещений об активности
    private boolean activityAlertsEnabled;
    private int activityDropThreshold; // Порог падения активности в процентах
    private int activityDropTimeWindow; // Временное окно для анализа в часах
    
    // Настройки оповещений о упоминаниях бренда
    private boolean brandMentionsEnabled;
    
    // Предпочтительный способ получения уведомлений
    private NotificationType preferredNotificationType;
    
    // Контактная информация
    private String telegramUsername;

    @ElementCollection
    @CollectionTable(name = "notification_channels")
    @Enumerated(EnumType.STRING)
    private Set<NotificationType> enabledChannels;

    @PrePersist
    protected void onCreate() {
        if (activityDropThreshold == 0) {
            activityDropThreshold = 50; // По умолчанию 50%
        }
        if (activityDropTimeWindow == 0) {
            activityDropTimeWindow = 2; // По умолчанию 2 часа
        }
    }
} 