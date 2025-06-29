package com.hospitalabc.tempservice.controller;

import com.hospitalabc.tempservice.model.AppointmentData;
import com.hospitalabc.tempservice.service.EmailNotificationService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class NotificationController {

    private final EmailNotificationService emailNotificationService;

    public NotificationController(EmailNotificationService emailNotificationService) {
        this.emailNotificationService = emailNotificationService;
    }

    @PostMapping("/api/notifications/appointment")
    public String sendAppointmentNotification(@RequestBody AppointmentData appointmentData) {
        emailNotificationService.sendAppointmentNotification(appointmentData);
        return "Notification sent successfully";
    }
}