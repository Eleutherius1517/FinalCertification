package com.socialanalytics.gateway.config;

import org.springframework.cloud.gateway.filter.ratelimit.KeyResolver;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import reactor.core.publisher.Mono;

@Configuration
public class RateLimiterConfig {

    @Bean
    public KeyResolver keyResolver() {
        return exchange -> {
            // Проверяем Authorization header
            String authHeader = exchange.getRequest().getHeaders().getFirst("Authorization");
            if (authHeader != null) {
                return Mono.just("auth_" + authHeader);
            }
            
            // Проверяем API key
            String apiKey = exchange.getRequest().getHeaders().getFirst("X-API-Key");
            if (apiKey != null) {
                return Mono.just("api_" + apiKey);
            }
            
            // Используем IP адрес как последний вариант
            return Mono.just("ip_" + exchange.getRequest().getRemoteAddress().getHostName());
        };
    }
} 