package com.socialanalytics.integrator.service;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.telegram.telegrambots.bots.TelegramLongPollingBot;
import org.telegram.telegrambots.meta.api.methods.updates.GetUpdates;
import org.telegram.telegrambots.meta.api.methods.groupadministration.GetChatMember;
import org.telegram.telegrambots.meta.api.objects.Chat;
import org.telegram.telegrambots.meta.api.objects.Message;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DataCollectionService extends TelegramLongPollingBot {

    private final RabbitTemplate rabbitTemplate;

    @Value("${rabbitmq.exchange}")
    private String exchange;

    @Value("${rabbitmq.routing-key.channel-data}")
    private String channelRoutingKey;

    @Value("${rabbitmq.routing-key.message-data}")
    private String messageRoutingKey;

    @Autowired
    public DataCollectionService(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    @Override
    public String getBotUsername() {
        return System.getenv("TELEGRAM_BOT_USERNAME");
    }

    @Override
    public String getBotToken() {
        return System.getenv("TELEGRAM_BOT_TOKEN");
    }

    @Override
    public void onUpdateReceived(Update update) {
        // Обработка полученных сообщений
        if (update.hasMessage() && update.getMessage().hasText()) {
            // Отправляем сообщение в очередь RabbitMQ для дальнейшей обработки
            rabbitTemplate.convertAndSend(exchange, messageRoutingKey, update);
        }
    }

    public void collectChannelData(String channelId, String networkType) {
        if ("telegram".equalsIgnoreCase(networkType)) {
            try {
                // Получаем информацию о канале
                Chat chat = execute(new GetUpdates())
                        .stream()
                        .filter(update -> update.getChannelPost() != null)
                        .map(update -> update.getChannelPost().getChat())
                        .filter(ch -> ch.getUserName() != null && ch.getUserName().equals(channelId))
                        .findFirst()
                        .orElseThrow(() -> new RuntimeException("Channel not found: " + channelId));

                // Создаем объект с данными канала
                Map<String, Object> channelData = new HashMap<>();
                channelData.put("channelId", channelId);
                channelData.put("networkType", networkType);
                channelData.put("title", chat.getTitle());
                channelData.put("description", chat.getDescription());
                channelData.put("type", chat.getType());
                channelData.put("username", chat.getUserName());
                channelData.put("id", chat.getId());

                // Отправляем данные в RabbitMQ
                rabbitTemplate.convertAndSend(exchange, channelRoutingKey, channelData);
            } catch (TelegramApiException e) {
                throw new RuntimeException("Error collecting channel data: " + e.getMessage(), e);
            }
        } else {
            throw new UnsupportedOperationException("Network type not supported: " + networkType);
        }
    }

    public void collectMessages(String channelId, String networkType, int limit) {
        if ("telegram".equalsIgnoreCase(networkType)) {
            try {
                // Получаем последние сообщения из канала
                List<Update> updates = execute(new GetUpdates());
                updates.stream()
                        .filter(update -> update.getChannelPost() != null)
                        .map(Update::getChannelPost)
                        .filter(message -> message.getChat().getUserName() != null 
                                && message.getChat().getUserName().equals(channelId))
                        .limit(limit)
                        .forEach(message -> {
                            Map<String, Object> messageData = new HashMap<>();
                            messageData.put("channelId", channelId);
                            messageData.put("networkType", networkType);
                            messageData.put("messageId", message.getMessageId());
                            messageData.put("text", message.getText());
                            messageData.put("date", message.getDate());
                            messageData.put("chatId", message.getChatId());
                            messageData.put("authorSignature", message.getAuthorSignature());
                            messageData.put("mediaGroupId", message.getMediaGroupId());
                            messageData.put("hasMediaContent", 
                                message.hasPhoto() || message.hasVideo() || 
                                message.hasDocument() || message.hasAudio());

                            // Отправляем данные в RabbitMQ
                            rabbitTemplate.convertAndSend(exchange, messageRoutingKey, messageData);
                        });
            } catch (TelegramApiException e) {
                throw new RuntimeException("Error collecting messages: " + e.getMessage(), e);
            }
        } else {
            throw new UnsupportedOperationException("Network type not supported: " + networkType);
        }
    }
} 