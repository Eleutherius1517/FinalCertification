package com.socialanalytics.auth.client;

import com.socialanalytics.auth.dto.TokenResponse;
import lombok.RequiredArgsConstructor;
import org.keycloak.admin.client.Keycloak;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class KeycloakClient {
    private final Keycloak keycloak;

    public TokenResponse refreshToken(String refreshToken) {
        var response = keycloak.tokenManager().refreshToken();
        return new TokenResponse(
            response.getToken(),
            response.getRefreshToken(),
            "Bearer",
            response.getExpiresIn(),
            response.getScope()
        );
    }

    public void logout(String refreshToken) {
        keycloak.close();
    }

    public void verifyEmail(String token) {
        keycloak.realm("social-analytics")
                .users()
                .get(token)
                .sendVerifyEmail();
    }

    public TokenResponse getTokens(String userId) {
        var response = keycloak.tokenManager().getAccessToken();
        return new TokenResponse(
            response.getToken(),
            response.getRefreshToken(),
            "Bearer",
            response.getExpiresIn(),
            response.getScope()
        );
    }

    public void resendVerification(String email) {
        keycloak.realm("social-analytics")
                .users()
                .get(email)
                .sendVerifyEmail();
    }

    public void sendPasswordResetEmail(String email) {
        keycloak.realm("social-analytics")
                .users()
                .get(email)
                .sendVerifyEmail();
    }

    public void resetPassword(String token, String newPassword) {
        org.keycloak.representations.idm.CredentialRepresentation credential = new org.keycloak.representations.idm.CredentialRepresentation();
        credential.setType(org.keycloak.representations.idm.CredentialRepresentation.PASSWORD);
        credential.setValue(newPassword);
        credential.setTemporary(false);
        
        keycloak.realm("social-analytics")
                .users()
                .get(token)
                .resetPassword(credential);
    }
} 