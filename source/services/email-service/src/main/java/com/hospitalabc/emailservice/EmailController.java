package com.hospitalabc.emailservice;

import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class EmailController {
    private final JavaMailSender mailSender;

    private final EmailTemplateReminder templateReminder;

    //public EmailController(JavaMailSender mailSender) {
    //    this.mailSender = mailSender;
    //}
    public EmailController(JavaMailSender mailSender, EmailTemplateReminder templateReminder) {
        this.mailSender = mailSender;
        this.templateReminder = templateReminder;
    }

    @PostMapping("/send-prescription-email")
    public String sendPrescriptionEmail(@RequestParam String to) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("pdai.congviec@gmail.com");
            message.setTo(to);
            message.setSubject("Nhắc nhở lấy thuốc");
            message.setText("Thuốc đã sẵn sàng, mời bệnh nhân đến quầy thuốc để nhận thuốc!");
            this.mailSender.send(message);
            return "Email sent successfully";
        } catch (MailException e) {
            return e.getMessage();
        }
    }
    @PostMapping("/send-appointment-reminder")
    public String sendAppointmentReminder(@RequestBody AppointmentReminderRequest request) {
        try {
            String emailContent = templateReminder.GenerateAppointmentReminderTemplate(
                    request.patientName(),
                    request.date(),
                    request.startTime(),
                    request.endTime(),
                    request.doctorName(),
                    request.consultationFee()
            );

            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("pdai.congviec@gmail.com");
            message.setTo(request.patientEmail());
            message.setSubject("Test email for Application: Nhắc nhở khám bệnh");
            message.setText(emailContent);

            this.mailSender.send(message);
            return "Appointment reminder email sent successfully";
        } catch (MailException e) {
            return "Failed to send reminder: " + e.getMessage();
        }
    }
    @PostMapping("/send-bulk-appointment-reminders")
    public Map<String, Object> sendBulkAppointmentReminders(@RequestBody List<AppointmentReminderRequest> requests) {
        List<String> successfulEmails = new ArrayList<>();
        List<Map<String, String>> failedEmails = new ArrayList<>();
        for (AppointmentReminderRequest request : requests) {
            try {
                String emailContent = templateReminder.GenerateAppointmentReminderTemplate(
                        request.patientName(),
                        request.date(),
                        request.startTime(),
                        request.endTime(),
                        request.doctorName(),
                        request.consultationFee()
                );

                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom("pdai.congviec@gmail.com");
                message.setTo(request.patientEmail());
                message.setSubject("Nhắc nhở khám bệnh");
                message.setText(emailContent);

                this.mailSender.send(message);
                successfulEmails.add(request.patientEmail());
            } catch (MailException e) {
                Map<String, String> failedEmail = new HashMap<>();
                failedEmail.put("email", request.patientEmail());
                failedEmail.put("error", e.getMessage());
                failedEmails.add(failedEmail);
            }
        }
        Map<String, Object> response = new HashMap<>();
        response.put("totalProcessed", requests.size());
        response.put("successful", successfulEmails.size());
        response.put("failed", failedEmails.size());
        response.put("successfulEmails", successfulEmails);
        response.put("failedEmails", failedEmails);

        return response;
    }
}

