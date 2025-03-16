package com.socialanalytics.integrator.config;

import org.springframework.amqp.core.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    @Value("${rabbitmq.queue.channel-data}")
    private String channelDataQueue;

    @Value("${rabbitmq.queue.message-data}")
    private String messageDataQueue;

    @Value("${rabbitmq.exchange}")
    private String exchange;

    @Value("${rabbitmq.routing-key.channel-data}")
    private String channelRoutingKey;

    @Value("${rabbitmq.routing-key.message-data}")
    private String messageRoutingKey;

    // Создаем очереди
    @Bean
    public Queue channelDataQueue() {
        return new Queue(channelDataQueue, true);
    }

    @Bean
    public Queue messageDataQueue() {
        return new Queue(messageDataQueue, true);
    }

    // Создаем exchange
    @Bean
    public TopicExchange exchange() {
        return new TopicExchange(exchange);
    }

    // Связываем очереди с exchange через routing keys
    @Bean
    public Binding channelDataBinding(Queue channelDataQueue, TopicExchange exchange) {
        return BindingBuilder
                .bind(channelDataQueue)
                .to(exchange)
                .with(channelRoutingKey);
    }

    @Bean
    public Binding messageDataBinding(Queue messageDataQueue, TopicExchange exchange) {
        return BindingBuilder
                .bind(messageDataQueue)
                .to(exchange)
                .with(messageRoutingKey);
    }
} 