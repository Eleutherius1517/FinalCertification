package com.socialanalytics.auth.controller;

import com.socialanalytics.auth.dto.RegisterRequest;
import com.socialanalytics.auth.dto.TokenResponse;
import com.socialanalytics.auth.service.GoogleAuthService;
import com.socialanalytics.auth.service.KeycloakService;
import com.socialanalytics.auth.service.TelegramAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final KeycloakService keycloakService;
    private final GoogleAuthService googleAuthService;
    private final TelegramAuthService telegramAuthService;

    @PostMapping("/register")
    public ResponseEntity<TokenResponse> register(@Valid @RequestBody RegisterRequest request) {
        String userId = keycloakService.createUser(request);
        return ResponseEntity.ok(keycloakService.getTokens(userId));
    }

    @PostMapping("/google")
    public ResponseEntity<TokenResponse> googleAuth(@RequestParam String code) {
        return ResponseEntity.ok(googleAuthService.authenticateGoogleUser(code));
    }

    @PostMapping("/telegram")
    public ResponseEntity<TokenResponse> telegramAuth(@RequestBody Map<String, String> telegramData) {
        return ResponseEntity.ok(telegramAuthService.authenticateTelegramUser(telegramData));
    }

    @PostMapping("/refresh")
    public ResponseEntity<TokenResponse> refreshToken(@RequestParam String refreshToken) {
        return ResponseEntity.ok(keycloakService.refreshToken(refreshToken));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestParam String refreshToken) {
        keycloakService.logout(refreshToken);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/verify-email")
    public ResponseEntity<Void> verifyEmail(@RequestParam String token) {
        keycloakService.verifyEmail(token);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<Void> resendVerification(@RequestParam String email) {
        keycloakService.resendVerification(email);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Void> forgotPassword(@RequestParam String email) {
        keycloakService.sendPasswordResetEmail(email);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Void> resetPassword(
            @RequestParam String token,
            @RequestParam String newPassword) {
        keycloakService.resetPassword(token, newPassword);
        return ResponseEntity.ok().build();
    }
} 