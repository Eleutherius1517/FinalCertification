package com.socialanalytics.notification.model;

public enum NotificationStatus {
    PENDING,    // Ожидает отправки
    SENT,       // Успешно отправлено
    FAILED,     // Ошибка при отправке
    READ        // Прочитано получателем
} 