package com.socialanalytics.integrator;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.ApplicationContext;
import org.telegram.telegrambots.meta.TelegramBotsApi;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;
import org.telegram.telegrambots.updatesreceivers.DefaultBotSession;
import com.socialanalytics.integrator.service.DataCollectionService;

@SpringBootApplication
@EnableDiscoveryClient
public class SocialIntegratorApplication {
    public static void main(String[] args) {
        ApplicationContext context = SpringApplication.run(SocialIntegratorApplication.class, args);
        
        try {
            TelegramBotsApi botsApi = new TelegramBotsApi(DefaultBotSession.class);
            DataCollectionService bot = context.getBean(DataCollectionService.class);
            botsApi.registerBot(bot);
        } catch (TelegramApiException e) {
            e.printStackTrace();
        }
    }
} 