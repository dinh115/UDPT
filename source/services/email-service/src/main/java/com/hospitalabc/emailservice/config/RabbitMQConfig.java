package com.hospitalabc.emailservice.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    @Bean
    public FanoutExchange emailExchange() {
        return new FanoutExchange("email_exchange");
    }

    @Bean
    public Queue emailQueue() {
        return new Queue("data_email_queue");
    }

    @Bean
    public Binding binding(Queue emailQueue, FanoutExchange emailExchange) {
        return BindingBuilder.bind(emailQueue).to(emailExchange);
    }
    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

}