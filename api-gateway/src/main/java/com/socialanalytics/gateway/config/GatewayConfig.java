package com.socialanalytics.gateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebFluxSecurity
public class GatewayConfig {

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
        http
            .csrf().disable()
            .cors().and()
            .authorizeExchange()
            .pathMatchers("/api/auth/**").permitAll()
            .pathMatchers("/api/social/**").authenticated()
            .pathMatchers("/api/analytics/**").authenticated()
            .pathMatchers("/api/notifications/**").authenticated()
            .anyExchange().authenticated()
            .and()
            .oauth2ResourceServer()
            .jwt();
        
        return http.build();
    }

    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration corsConfig = new CorsConfiguration();
        corsConfig.setAllowedOrigins(Arrays.asList("*"));
        corsConfig.setMaxAge(3600L);
        corsConfig.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        corsConfig.setAllowedHeaders(Arrays.asList("*"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);

        return new CorsWebFilter(source);
    }

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
            .route("auth_route", r -> r
                .path("/api/auth/**")
                .filters(f -> f
                    .stripPrefix(1)
                    .addResponseHeader("X-Response-Time", String.valueOf(System.currentTimeMillis())))
                .uri("lb://auth-service"))
            .route("social_route", r -> r
                .path("/api/social/**")
                .filters(f -> f
                    .stripPrefix(1)
                    .addResponseHeader("X-Response-Time", String.valueOf(System.currentTimeMillis())))
                .uri("lb://social-integrator-service"))
            .route("analytics_route", r -> r
                .path("/api/analytics/**")
                .filters(f -> f
                    .stripPrefix(1)
                    .addResponseHeader("X-Response-Time", String.valueOf(System.currentTimeMillis())))
                .uri("lb://analytics-service"))
            .route("notification_route", r -> r
                .path("/api/notifications/**")
                .filters(f -> f
                    .stripPrefix(1)
                    .addResponseHeader("X-Response-Time", String.valueOf(System.currentTimeMillis())))
                .uri("lb://notification-service"))
            .build();
    }
} 