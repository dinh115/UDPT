package com.hospitalabc.tempservice.service;

import com.hospitalabc.tempservice.model.AppointmentData;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
public class EmailNotificationService {

    private final RabbitTemplate rabbitTemplate;

    public EmailNotificationService(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void sendAppointmentNotification(AppointmentData appointmentData) {
        rabbitTemplate.convertAndSend("email_exchange", "", appointmentData);
    }
}