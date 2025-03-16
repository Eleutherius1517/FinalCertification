package com.socialanalytics.notification.service;

import com.socialanalytics.notification.model.Notification;
import com.socialanalytics.notification.model.NotificationPreferences;
import com.socialanalytics.notification.model.NotificationType;
import com.socialanalytics.notification.repository.NotificationPreferencesRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class TriggerService {
    private final NotificationService notificationService;
    private final NotificationPreferencesRepository preferencesRepository;

    public void checkActivityDrop(String channelId, Map<String, Integer> activityMetrics) {
        List<NotificationPreferences> preferences = preferencesRepository.findByActivityAlertsEnabledTrue();
        
        for (NotificationPreferences pref : preferences) {
            int currentActivity = activityMetrics.getOrDefault(channelId, 0);
            int previousActivity = getPreviousActivity(channelId, pref.getActivityDropTimeWindow());
            
            if (previousActivity > 0) {
                int dropPercentage = ((previousActivity - currentActivity) / previousActivity) * 100;
                
                if (dropPercentage >= pref.getActivityDropThreshold()) {
                    createActivityAlert(pref.getUserId(), channelId, dropPercentage);
                }
            }
        }
    }

    public void checkBrandMentions(String channelId, String message, Set<String> keywords) {
        List<NotificationPreferences> preferences = preferencesRepository.findByBrandMentionsEnabledTrue();
        
        for (String keyword : keywords) {
            if (message.toLowerCase().contains(keyword.toLowerCase())) {
                for (NotificationPreferences pref : preferences) {
                    createBrandMentionAlert(pref.getUserId(), channelId, keyword);
                }
                break;
            }
        }
    }

    private void createActivityAlert(String userId, String channelId, int dropPercentage) {
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setType(NotificationType.TELEGRAM);
        notification.setTitle("Alert: Activity Drop Detected");
        notification.setContent(String.format(
            "Channel %s has experienced a %d%% drop in activity over the last %d hours.",
            channelId, dropPercentage, 2
        ));
        
        notificationService.sendNotification(notification);
    }

    private void createBrandMentionAlert(String userId, String channelId, String keyword) {
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setType(NotificationType.TELEGRAM);
        notification.setTitle("Brand Mention Alert");
        notification.setContent(String.format(
            "Your brand keyword '%s' was mentioned in channel @%s",
            keyword, channelId
        ));
        
        notificationService.sendNotification(notification);
    }

    private int getPreviousActivity(String channelId, int hours) {
        // TODO: Implement activity history retrieval from database
        return 100; // Placeholder
    }
} 