package com.hospitalabc.emailservice;

import org.springframework.stereotype.Service;

@Service
public class EmailTemplateReminder {
    public String GenerateAppointmentReminderTemplate(
            String patientName,
            String date,
            String startTime,
            String endTime,
            String doctorName,
            int consultationFee)
    {
        return String.format("""
            Kính gửi bệnh nhận %s,
            
            Đây là thư nhắc nhở lịch khám bệnh với chi tiết như sau
            
            - Ngày: %s
            - Thời gian: %s đến %s
            - Bác sĩ: %s
            - Phí khám bệnh: %d đồng
            
            Vui lòng bệnh nhân hãy đến đúng giờ. Xin cảm ơn vì đã chọn dịch vụ của chúng tôi!
            
            Trân trọng,
            Bệnh viện ABC""",
                patientName,
                date,
                startTime,
                endTime,
                doctorName,
                consultationFee
        );
    }
}
