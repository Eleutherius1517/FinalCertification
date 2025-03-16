package com.socialanalytics.gateway.config;

import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Configuration
public class LoggingConfig {

    @Bean
    @Order(-1)
    public GlobalFilter loggingFilter() {
        return (exchange, chain) -> {
            ServerHttpRequest request = exchange.getRequest();
            ServerHttpResponse response = exchange.getResponse();
            
            String correlationId = UUID.randomUUID().toString();
            String path = request.getPath().value();
            String method = request.getMethod().name();
            String userAgent = request.getHeaders().getFirst("User-Agent");
            String ip = request.getRemoteAddress().getAddress().getHostAddress();
            
            long startTime = System.currentTimeMillis();
            
            return chain.filter(exchange)
                .doFinally(signalType -> {
                    long totalTime = System.currentTimeMillis() - startTime;
                    String logMessage = String.format(
                        "CorrelationId: %s | Path: %s | Method: %s | User-Agent: %s | IP: %s | Time: %dms | Status: %s",
                        correlationId,
                        path,
                        method,
                        userAgent,
                        ip,
                        totalTime,
                        response.getStatusCode()
                    );
                    System.out.println(logMessage);
                });
        };
    }
} 