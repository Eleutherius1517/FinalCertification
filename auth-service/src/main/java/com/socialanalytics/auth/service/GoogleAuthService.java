package com.socialanalytics.auth.service;

import com.socialanalytics.auth.dto.TokenResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class GoogleAuthService {

    @Value("${google.client.id}")
    private String clientId;

    @Value("${google.client.secret}")
    private String clientSecret;

    @Value("${keycloak.auth-server-url}")
    private String keycloakUrl;

    @Value("${keycloak.realm}")
    private String realm;

    @Value("${keycloak.resource}")
    private String keycloakClientId;

    @Value("${keycloak.credentials.secret}")
    private String keycloakClientSecret;

    private final RestTemplate restTemplate;
    private final KeycloakService keycloakService;

    public TokenResponse authenticateGoogleUser(String code) {
        // Получаем access_token от Google
        String tokenUrl = "https://oauth2.googleapis.com/token";
        Map<String, String> params = Map.of(
            "code", code,
            "client_id", clientId,
            "client_secret", clientSecret,
            "redirect_uri", "http://localhost:3000/auth/google/callback",
            "grant_type", "authorization_code"
        );

        Map<String, String> tokenResponse = restTemplate.postForObject(tokenUrl, params, Map.class);
        String accessToken = tokenResponse.get("access_token");

        // Получаем информацию о пользователе
        String userInfoUrl = "https://www.googleapis.com/oauth2/v3/userinfo";
        Map<String, String> userInfo = restTemplate.getForObject(userInfoUrl, Map.class);

        String googleId = userInfo.get("sub");
        String email = userInfo.get("email");
        String firstName = userInfo.get("given_name");
        String lastName = userInfo.get("family_name");

        // Проверяем, существует ли пользователь с таким google_id
        String userId = findUserByGoogleId(googleId);
        if (userId == null) {
            // Создаем нового пользователя
            userId = createNewGoogleUser(googleId, email, firstName, lastName);
        }

        // Получаем токены от Keycloak
        return getKeycloakTokens(userId);
    }

    private String findUserByGoogleId(String googleId) {
        // Поиск пользователя в Keycloak по google_id
        return keycloakService.findUserByGoogleId(googleId);
    }

    private String createNewGoogleUser(String googleId, String email, String firstName, String lastName) {
        // Создаем нового пользователя в Keycloak
        String userId = keycloakService.createGoogleUser(googleId, email, firstName, lastName);
        return userId;
    }

    private TokenResponse getKeycloakTokens(String userId) {
        // Получаем токены от Keycloak
        String tokenUrl = keycloakUrl + "/realms/" + realm + "/protocol/openid-connect/token";
        
        Map<String, String> params = Map.of(
            "grant_type", "password",
            "client_id", keycloakClientId,
            "client_secret", keycloakClientSecret,
            "username", userId,
            "password", userId // Используем userId как пароль для Google-пользователей
        );

        return restTemplate.postForObject(tokenUrl, params, TokenResponse.class);
    }
} 