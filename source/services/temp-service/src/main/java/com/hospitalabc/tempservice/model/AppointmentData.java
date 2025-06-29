package com.hospitalabc.tempservice.model;

import java.io.Serializable;

//public class TempServiceDTO {
//}
public record AppointmentData(
        String patientName,
        String patientEmail,
        String date,
        String startTime,
        String endTime,
        String doctorName,
        int consultationFee
) implements Serializable {}
