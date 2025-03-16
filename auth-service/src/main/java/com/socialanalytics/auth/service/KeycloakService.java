package com.socialanalytics.auth.service;

import com.socialanalytics.auth.dto.RegisterRequest;
import com.socialanalytics.auth.dto.TokenResponse;
import com.socialanalytics.auth.client.KeycloakClient;
import lombok.RequiredArgsConstructor;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.ws.rs.core.Response;
import java.util.Collections;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class KeycloakService {

    @Value("${keycloak.realm}")
    private String realm;

    @Value("${keycloak.resource}")
    private String clientId;

    private final Keycloak keycloak;
    private final KeycloakClient keycloakClient;

    public String createUser(RegisterRequest request) {
        RealmResource realmResource = keycloak.realm(realm);
        UsersResource usersResource = realmResource.users();

        UserRepresentation user = new UserRepresentation();
        user.setEnabled(true);
        user.setUsername(request.getEmail());
        user.setEmail(request.getEmail());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());

        CredentialRepresentation credential = new CredentialRepresentation();
        credential.setType(CredentialRepresentation.PASSWORD);
        credential.setValue(request.getPassword());
        credential.setTemporary(false);

        user.setCredentials(Collections.singletonList(credential));

        Response response = usersResource.create(user);
        String userId = response.getLocation().getPath().substring(response.getLocation().getPath().lastIndexOf('/') + 1);

        // Добавляем роль USER
        UserResource userResource = usersResource.get(userId);
        userResource.roles().realmLevel().add(Collections.singletonList(realmResource.roles().get("USER").toRepresentation()));

        return userId;
    }

    public void updateUser(String userId, String telegramId) {
        RealmResource realmResource = keycloak.realm(realm);
        UserResource userResource = realmResource.users().get(userId);

        UserRepresentation user = userResource.toRepresentation();
        user.setAttributes(Collections.singletonMap("telegram_id", Collections.singletonList(telegramId)));
        userResource.update(user);
    }

    public void updateUser(String userId, String googleId, String email) {
        RealmResource realmResource = keycloak.realm(realm);
        UserResource userResource = realmResource.users().get(userId);

        UserRepresentation user = userResource.toRepresentation();
        user.setAttributes(Collections.singletonMap("google_id", Collections.singletonList(googleId)));
        user.setEmail(email);
        userResource.update(user);
    }

    public void disableUser(String userId) {
        RealmResource realmResource = keycloak.realm(realm);
        UserResource userResource = realmResource.users().get(userId);

        UserRepresentation user = userResource.toRepresentation();
        user.setEnabled(false);
        userResource.update(user);
    }

    public void enableUser(String userId) {
        RealmResource realmResource = keycloak.realm(realm);
        UserResource userResource = realmResource.users().get(userId);

        UserRepresentation user = userResource.toRepresentation();
        user.setEnabled(true);
        userResource.update(user);
    }

    public TokenResponse refreshToken(String refreshToken) {
        return keycloakClient.refreshToken(refreshToken);
    }

    public void logout(String refreshToken) {
        keycloakClient.logout(refreshToken);
    }

    public void verifyEmail(String token) {
        keycloakClient.verifyEmail(token);
    }

    public TokenResponse getTokens(String userId) {
        return keycloakClient.getTokens(userId);
    }

    public void resendVerification(String email) {
        keycloakClient.resendVerification(email);
    }

    public void sendPasswordResetEmail(String email) {
        keycloakClient.sendPasswordResetEmail(email);
    }

    public void resetPassword(String token, String newPassword) {
        keycloakClient.resetPassword(token, newPassword);
    }

    public String findUserByGoogleId(String googleId) {
        RealmResource realmResource = keycloak.realm(realm);
        return realmResource.users().search(null, null, null, null, 0, 1)
                .stream()
                .filter(user -> user.getAttributes() != null && 
                        user.getAttributes().get("google_id") != null &&
                        user.getAttributes().get("google_id").contains(googleId))
                .findFirst()
                .map(UserRepresentation::getId)
                .orElse(null);
    }

    public String createGoogleUser(String googleId, String email, String firstName, String lastName) {
        RealmResource realmResource = keycloak.realm(realm);
        UsersResource usersResource = realmResource.users();

        UserRepresentation user = new UserRepresentation();
        user.setEnabled(true);
        user.setUsername(email);
        user.setEmail(email);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setAttributes(Collections.singletonMap("google_id", Collections.singletonList(googleId)));

        Response response = usersResource.create(user);
        String userId = response.getLocation().getPath().substring(response.getLocation().getPath().lastIndexOf('/') + 1);

        UserResource userResource = usersResource.get(userId);
        userResource.roles().realmLevel().add(Collections.singletonList(realmResource.roles().get("USER").toRepresentation()));

        return userId;
    }

    public String findUserByTelegramId(String telegramId) {
        RealmResource realmResource = keycloak.realm(realm);
        return realmResource.users().search(null, null, null, null, 0, 1)
                .stream()
                .filter(user -> user.getAttributes() != null && 
                        user.getAttributes().get("telegram_id") != null &&
                        user.getAttributes().get("telegram_id").contains(telegramId))
                .findFirst()
                .map(UserRepresentation::getId)
                .orElse(null);
    }

    public String createTelegramUser(String telegramId, String firstName, String lastName, String username) {
        RealmResource realmResource = keycloak.realm(realm);
        UsersResource usersResource = realmResource.users();

        UserRepresentation user = new UserRepresentation();
        user.setEnabled(true);
        user.setUsername(username != null ? username : telegramId);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setAttributes(Collections.singletonMap("telegram_id", Collections.singletonList(telegramId)));

        Response response = usersResource.create(user);
        String userId = response.getLocation().getPath().substring(response.getLocation().getPath().lastIndexOf('/') + 1);

        UserResource userResource = usersResource.get(userId);
        userResource.roles().realmLevel().add(Collections.singletonList(realmResource.roles().get("USER").toRepresentation()));

        return userId;
    }
} 