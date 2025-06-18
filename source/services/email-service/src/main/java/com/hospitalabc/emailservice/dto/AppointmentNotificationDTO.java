package com.hospitalabc.emailservice.dto;

public record AppointmentNotificationDTO(
        String patientName,
        String patientEmail,
        String date,
        String startTime,
        String endTime,
        String doctorName,
        int consultationFee
) {}
