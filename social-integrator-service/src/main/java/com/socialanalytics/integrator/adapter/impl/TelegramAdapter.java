package com.socialanalytics.integrator.adapter.impl;

import com.socialanalytics.integrator.adapter.SocialNetworkAdapter;
import com.socialanalytics.integrator.model.ChannelData;
import com.socialanalytics.integrator.model.MessageData;
import com.socialanalytics.integrator.model.ReactionData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.telegram.telegrambots.meta.api.objects.Chat;
import org.telegram.telegrambots.meta.api.objects.Message;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.updatesreceivers.DefaultBotSession;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class TelegramAdapter implements SocialNetworkAdapter {

    @Value("${telegram.bot.token}")
    private String botToken;

    @Value("${telegram.bot.username}")
    private String botUsername;

    @Override
    public ChannelData fetchChannelData(String channelId) {
        // TODO: Реализовать получение данных о канале через Telegram Bot API
        return null;
    }

    @Override
    public List<MessageData> fetchMessages(String channelId, int limit) {
        // TODO: Реализовать получение сообщений через Telegram Bot API
        return new ArrayList<>();
    }

    @Override
    public List<ReactionData> fetchReactions(String messageId) {
        // TODO: Реализовать получение реакций через Telegram Bot API
        return new ArrayList<>();
    }

    @Override
    public ChannelData normalizeChannelData(Object rawData) {
        if (rawData instanceof Chat) {
            Chat chat = (Chat) rawData;
            ChannelData channelData = new ChannelData();
            channelData.setId(String.valueOf(chat.getId()));
            channelData.setName(chat.getTitle());
            channelData.setDescription(chat.getDescription());
            channelData.setUrl("https://t.me/" + chat.getUserName());
            channelData.setNetworkType("TELEGRAM");
            channelData.setLastUpdated(LocalDateTime.now());
            channelData.setCreatedAt(LocalDateTime.now());
            return channelData;
        }
        return null;
    }

    @Override
    public MessageData normalizeMessageData(Object rawData) {
        if (rawData instanceof Message) {
            Message message = (Message) rawData;
            MessageData messageData = new MessageData();
            messageData.setId(String.valueOf(message.getMessageId()));
            messageData.setChannelId(String.valueOf(message.getChatId()));
            messageData.setText(message.getText());
            messageData.setUrl("https://t.me/c/" + message.getChatId() + "/" + message.getMessageId());
            messageData.setViewsCount(0);
            messageData.setPublishedAt(LocalDateTime.ofInstant(
                Instant.ofEpochSecond(message.getDate()),
                ZoneId.systemDefault()
            ));
            messageData.setLastUpdated(LocalDateTime.now());
            
            if (message.getAuthorSignature() != null) {
                messageData.setAuthor(message.getAuthorSignature());
            }
            
            messageData.setHasMedia(
                message.hasPhoto() || 
                message.hasVideo() || 
                message.hasDocument() || 
                message.hasAudio()
            );
            
            return messageData;
        }
        return null;
    }

    @Override
    public ReactionData normalizeReactionData(Object rawData) {
        if (rawData instanceof Update) {
            Update update = (Update) rawData;
            if (update.getMessage() != null && update.getMessage().isReply()) {
                Message replyMessage = update.getMessage();
                ReactionData reactionData = new ReactionData();
                reactionData.setId(String.valueOf(replyMessage.getReplyToMessage().getMessageId()));
                reactionData.setEmoji("👍"); // Используем стандартный лайк, так как прямой доступ к реакциям ограничен
                reactionData.setCount(1);
                reactionData.setNetworkType("TELEGRAM");
                return reactionData;
            }
        }
        return null;
    }
} 