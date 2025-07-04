import grpc
import asyncio
import os

import aiosmtplib
from email.message import EmailMessage

import notification_pb2
import notification_pb2_grpc

EMAIL_ADDRESS = os.getenv("EMAIL_ADDRESS", "pdai.congviec@gmail.com")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD", "ixouorzcsxgrsdeu")


class AppointmentServiceServicer(notification_pb2_grpc.AppointmentServiceServicer):
    def __init__(self, smtp_client: aiosmtplib.SMTP):
        self.smtp = smtp_client

    async def SendReminder(self, request, context):
        email_body = f"""\
Kính gửi bệnh nhân {request.patientName},

Đây là thư nhắc nhở lịch khám bệnh với chi tiết như sau:

- Ngày: {request.date}
- Thời gian: {request.startTime} đến {request.endTime}
- Bác sĩ: {request.doctorName}
- Phí khám bệnh: {request.consultationFee} đồng

Vui lòng bệnh nhân hãy đến đúng giờ. Xin cảm ơn vì đã chọn dịch vụ của chúng tôi!

Trân trọng,
Bệnh viện ABC
"""

        msg = EmailMessage()
        msg["Subject"] = "Thư nhắc lịch khám bệnh"
        msg["From"] = EMAIL_ADDRESS
        msg["To"] = request.patientEmail
        msg.set_content(email_body)

        try:
            # Reuse the already-connected SMTP client
            await self.smtp.send_message(msg)
            return notification_pb2.AppointmentResponse(
                success=True,
                message="Email sent successfully."
            )
        except Exception as e:
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details(f"Failed to send email: {e}")
            return notification_pb2.AppointmentResponse(
                success=False,
                message=str(e)
            )
    async def SendPrescriptionReady(self, request, context):
        email_body = """\
Kính gửi bệnh nhân,

Thuốc của bạn đã sẵn sàng. Vui lòng bạn đến quầy thuốc để nhận thuốc.

Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!

Trân trọng,
Bệnh viện ABC
"""

        msg = EmailMessage()
        msg["Subject"] = "Thông báo thuốc đã sẵn sàng"
        msg["From"] = EMAIL_ADDRESS
        msg["To"] = request.patientEmail
        msg.set_content(email_body)

        try:
            await self.smtp.send_message(msg)
            return notification_pb2.AppointmentResponse(
                success=True,
                message="Prescription ready email sent."
            )
        except Exception as e:
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details(f"Failed to send prescription email: {e}")
            return notification_pb2.AppointmentResponse(
                success=False,
                message=str(e)
            )

async def serve():
    # 1) Create and connect SMTP client once
    smtp_client = aiosmtplib.SMTP(
        hostname="smtp.gmail.com",
        port=465,
        use_tls=True
    )
    await smtp_client.connect()
    await smtp_client.login(EMAIL_ADDRESS, EMAIL_PASSWORD)

    # 2) Hook it into your gRPC service
    server = grpc.aio.server()
    servicer = AppointmentServiceServicer(smtp_client)
    notification_pb2_grpc.add_AppointmentServiceServicer_to_server(servicer, server)
    server.add_insecure_port("[::]:3006")

    await server.start()
    print("gRPC server is running on port 3006 with SMTP connection pooled.")
    await server.wait_for_termination()


if __name__ == "__main__":
    asyncio.run(serve())
