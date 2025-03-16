package com.socialanalytics.notification.config;

import com.socialanalytics.notification.service.TelegramBot;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.telegram.telegrambots.meta.TelegramBotsApi;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;
import org.telegram.telegrambots.updatesreceivers.DefaultBotSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class TelegramConfig {

    private final TelegramBot telegramBot;

    @Bean
    public TelegramBotsApi telegramBotsApi() throws TelegramApiException {
        TelegramBotsApi api = new TelegramBotsApi(DefaultBotSession.class);
        try {
            api.registerBot(telegramBot);
            log.info("Telegram bot successfully registered");
        } catch (TelegramApiException e) {
            log.error("Failed to register Telegram bot", e);
            throw e;
        }
        return api;
    }
} 