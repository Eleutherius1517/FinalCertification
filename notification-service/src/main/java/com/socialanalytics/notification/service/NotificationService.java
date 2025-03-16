package com.socialanalytics.notification.service;

import com.socialanalytics.notification.model.Notification;
import com.socialanalytics.notification.model.NotificationPreferences;
import com.socialanalytics.notification.model.NotificationStatus;
import com.socialanalytics.notification.model.NotificationType;
import com.socialanalytics.notification.repository.NotificationRepository;
import com.socialanalytics.notification.repository.NotificationPreferencesRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final NotificationPreferencesRepository preferencesRepository;
    private final TelegramBot telegramBot;

    public void sendNotification(Notification notification) {
        try {
            NotificationPreferences preferences = preferencesRepository.findById(notification.getUserId())
                    .orElseThrow(() -> new RuntimeException("Preferences not found for user: " + notification.getUserId()));

            if (preferences.getEnabledChannels().contains(notification.getType())) {
                switch (notification.getType()) {
                    case TELEGRAM -> sendTelegram(notification, preferences.getTelegramUsername());
                }
                notification.setStatus(NotificationStatus.SENT);
                notification.setSentAt(LocalDateTime.now());
            }
        } catch (Exception e) {
            log.error("Failed to send notification: {}", e.getMessage());
            notification.setStatus(NotificationStatus.FAILED);
            notification.setErrorMessage(e.getMessage());
        } finally {
            notificationRepository.save(notification);
        }
    }

    private void sendTelegram(Notification notification, String username) throws TelegramApiException {
        if (username == null || username.isEmpty()) {
            throw new IllegalArgumentException("Telegram username is not set for user: " + notification.getUserId());
        }

        String chatId = username.startsWith("@") ? username : "@" + username;
        
        SendMessage message = SendMessage.builder()
                .chatId(chatId)
                .text(String.format("%s\n\n%s", notification.getTitle(), notification.getContent()))
                .build();
        
        telegramBot.execute(message);
    }
} 