package com.socialanalytics.auth.service;

import com.socialanalytics.auth.dto.TokenResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class TelegramAuthService {

    @Value("${telegram.bot.token}")
    private String botToken;

    @Value("${keycloak.auth-server-url}")
    private String keycloakUrl;

    @Value("${keycloak.realm}")
    private String realm;

    @Value("${keycloak.resource}")
    private String clientId;

    @Value("${keycloak.credentials.secret}")
    private String clientSecret;

    private final RestTemplate restTemplate;
    private final KeycloakService keycloakService;

    public TokenResponse authenticateTelegramUser(Map<String, String> telegramData) {
        // Проверяем данные от Telegram
        if (!validateTelegramData(telegramData)) {
            throw new RuntimeException("Неверные данные от Telegram");
        }

        String telegramId = telegramData.get("id");
        String firstName = telegramData.get("first_name");
        String lastName = telegramData.get("last_name");
        String username = telegramData.get("username");

        // Проверяем, существует ли пользователь с таким telegram_id
        String userId = findUserByTelegramId(telegramId);
        if (userId == null) {
            // Создаем нового пользователя
            userId = createNewTelegramUser(telegramId, firstName, lastName, username);
        }

        // Получаем токены от Keycloak
        return getKeycloakTokens(userId);
    }

    private boolean validateTelegramData(Map<String, String> data) {
        // Проверяем хэш данных от Telegram
        String hash = data.remove("hash");
        String checkString = data.entrySet().stream()
            .sorted(Map.Entry.comparingByKey())
            .map(e -> e.getKey() + "=" + e.getValue())
            .reduce((a, b) -> a + "\n" + b)
            .orElse("");
        
        String secretKey = org.apache.commons.codec.digest.DigestUtils.sha1Hex(botToken);
        String calculatedHash = org.apache.commons.codec.digest.DigestUtils.sha1Hex(checkString);
        
        return calculatedHash.equals(hash);
    }

    private String findUserByTelegramId(String telegramId) {
        // Поиск пользователя в Keycloak по telegram_id
        return keycloakService.findUserByTelegramId(telegramId);
    }

    private String createNewTelegramUser(String telegramId, String firstName, String lastName, String username) {
        // Создаем нового пользователя в Keycloak
        String userId = keycloakService.createTelegramUser(telegramId, firstName, lastName, username);
        return userId;
    }

    private TokenResponse getKeycloakTokens(String userId) {
        // Получаем токены от Keycloak
        String tokenUrl = keycloakUrl + "/realms/" + realm + "/protocol/openid-connect/token";
        
        Map<String, String> params = Map.of(
            "grant_type", "password",
            "client_id", clientId,
            "client_secret", clientSecret,
            "username", userId,
            "password", userId // Используем userId как пароль для Telegram-пользователей
        );

        return restTemplate.postForObject(tokenUrl, params, TokenResponse.class);
    }
} 