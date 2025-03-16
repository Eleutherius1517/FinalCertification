package com.socialanalytics.integrator.adapter;

import com.socialanalytics.integrator.model.ChannelData;
import com.socialanalytics.integrator.model.MessageData;
import com.socialanalytics.integrator.model.ReactionData;

import java.util.List;

public interface SocialNetworkAdapter {
    /**
     * Получение данных о канале
     * @param channelId идентификатор канала
     * @return данные о канале
     */
    ChannelData fetchChannelData(String channelId);

    /**
     * Получение сообщений канала
     * @param channelId идентификатор канала
     * @param limit максимальное количество сообщений
     * @return список сообщений
     */
    List<MessageData> fetchMessages(String channelId, int limit);

    /**
     * Получение реакций на сообщение
     * @param messageId идентификатор сообщения
     * @return список реакций
     */
    List<ReactionData> fetchReactions(String messageId);

    /**
     * Нормализация данных канала в единый формат системы
     * @param rawData сырые данные канала
     * @return нормализованные данные
     */
    ChannelData normalizeChannelData(Object rawData);

    /**
     * Нормализация данных сообщения в единый формат системы
     * @param rawData сырые данные сообщения
     * @return нормализованные данные
     */
    MessageData normalizeMessageData(Object rawData);

    /**
     * Нормализация данных реакции в единый формат системы
     * @param rawData сырые данные реакции
     * @return нормализованные данные
     */
    ReactionData normalizeReactionData(Object rawData);
} 