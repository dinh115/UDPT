package com.hospitalabc.emailservice.service;

import com.hospitalabc.emailservice.AppointmentReminderRequest;
import com.hospitalabc.emailservice.EmailController;
import com.hospitalabc.emailservice.dto.AppointmentNotificationDTO;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
public class EmailNotificationConsumer {

    private final EmailController emailController;

    public EmailNotificationConsumer(EmailController emailController) {
        this.emailController = emailController;
    }

    @RabbitListener(queues = "data_email_queue")
    public void handleAppointmentNotification(AppointmentNotificationDTO notification) {
        try {
            emailController.sendAppointmentReminder(
                    new AppointmentReminderRequest(
                            notification.patientName(),
                            notification.patientEmail(),
                            notification.date(),
                            notification.startTime(),
                            notification.endTime(),
                            notification.doctorName(),
                            notification.consultationFee()
                    )
            );
        } catch (Exception e) {
            // Log error and possibly implement retry logic
            System.err.println("Failed to process appointment notification: " + e.getMessage());
        }
    }
}