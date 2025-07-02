package com.hospitalabc.emailservice;

public record AppointmentReminderRequest(
        String patientName,
        String patientEmail,
        String date,
        String startTime,
        String endTime,
        String doctorName,
        int consultationFee
) {}
