package com.socialanalytics.gateway.config;

import org.springframework.boot.web.reactive.error.ErrorWebExceptionHandler;
import org.springframework.cloud.gateway.support.NotFoundException;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class ErrorConfig {

    @Bean
    @Order(-1)
    public ErrorWebExceptionHandler errorWebExceptionHandler() {
        return (ServerWebExchange exchange, Throwable ex) -> {
            Map<String, Object> response = new HashMap<>();
            
            if (ex instanceof NotFoundException) {
                response.put("status", HttpStatus.NOT_FOUND.value());
                response.put("error", "Сервис не найден");
                response.put("message", ex.getMessage());
                exchange.getResponse().setStatusCode(HttpStatus.NOT_FOUND);
            } else if (ex instanceof ResponseStatusException) {
                ResponseStatusException responseStatusException = (ResponseStatusException) ex;
                HttpStatus status = (HttpStatus) responseStatusException.getStatusCode();
                response.put("status", status.value());
                response.put("error", status.getReasonPhrase());
                response.put("message", responseStatusException.getMessage());
                exchange.getResponse().setStatusCode(status);
            } else {
                response.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
                response.put("error", "Внутренняя ошибка сервера");
                response.put("message", ex.getMessage());
                exchange.getResponse().setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR);
            }

            exchange.getResponse().getHeaders().setContentType(MediaType.APPLICATION_JSON);
            return exchange.getResponse().writeWith(
                Mono.just(exchange.getResponse().bufferFactory().wrap(
                    response.toString().getBytes()
                ))
            );
        };
    }
} 