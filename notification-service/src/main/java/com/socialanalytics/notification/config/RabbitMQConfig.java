package com.socialanalytics.notification.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {
    @Value("${rabbitmq.queue.notifications}")
    private String notificationsQueue;

    @Value("${rabbitmq.exchange.notifications}")
    private String notificationsExchange;

    @Value("${rabbitmq.routing.key.notifications}")
    private String notificationsRoutingKey;

    @Bean
    public Queue notificationsQueue() {
        return new Queue(notificationsQueue);
    }

    @Bean
    public DirectExchange notificationsExchange() {
        return new DirectExchange(notificationsExchange);
    }

    @Bean
    public Binding binding(Queue notificationsQueue, DirectExchange notificationsExchange) {
        return BindingBuilder
                .bind(notificationsQueue)
                .to(notificationsExchange)
                .with(notificationsRoutingKey);
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(new Jackson2JsonMessageConverter());
        return rabbitTemplate;
    }
} 