# import grpc
# import asyncio
# import os
# import aio_pika
# import json
# import signal

# import notification_pb2
# import notification_pb2_grpc

# RABBITMQ_URL = os.getenv("RABBITMQ_URL", "amqp://guest:guest@rabbitmq-notification/")
# EMAIL_EXCHANGE = "email_exchange"
# EMAIL_QUEUE = "data_email_queue"

# class AppointmentServiceServicer(notification_pb2_grpc.AppointmentServiceServicer):
#     def __init__(self, channel: aio_pika.RobustChannel):
#         self.channel = channel

#     async def _publish_to_queue(self, routing_key, message_body):
#         exchange = await self.channel.get_exchange(EMAIL_EXCHANGE)
#         await exchange.publish(
#             aio_pika.Message(body=json.dumps(message_body).encode()),
#             routing_key=routing_key
#         )

#     async def SendReminder(self, request, context):
#         payload = {
#             "type": "reminder",
#             "patientName": request.patientName,
#             "patientEmail": request.patientEmail,
#             "date": request.date,
#             "startTime": request.startTime,
#             "endTime": request.endTime,
#             "doctorName": request.doctorName,
#             "consultationFee": request.consultationFee,
#         }
#         await self._publish_to_queue(EMAIL_QUEUE, payload)

#         return notification_pb2.AppointmentResponse(
#             success=True,
#             message="Email request queued successfully."
#         )

#     async def SendPrescriptionReady(self, request, context):
#         payload = {
#             "type": "prescription",
#             "patientEmail": request.patientEmail
#         }
#         await self._publish_to_queue(EMAIL_QUEUE, payload)

#         return notification_pb2.AppointmentResponse(
#             success=True,
#             message="Prescription email request queued successfully."
#         )


# async def serve():
#     connection = await aio_pika.connect_robust(RABBITMQ_URL)
#     channel = await connection.channel()

#     await channel.declare_exchange(EMAIL_EXCHANGE, type='fanout', durable=True)
#     await channel.declare_queue(EMAIL_QUEUE, durable=True)
#     queue = await channel.get_queue(EMAIL_QUEUE)
#     await queue.bind(EMAIL_EXCHANGE, routing_key=EMAIL_QUEUE)

#     server = grpc.aio.server()
#     servicer = AppointmentServiceServicer(channel)
#     notification_pb2_grpc.add_AppointmentServiceServicer_to_server(servicer, server)
#     server.add_insecure_port("[::]:3006")

#     await server.start()
#     print("gRPC server running with RabbitMQ integration.")

#     try:
#         await server.wait_for_termination()
#     except KeyboardInterrupt:
#         print("Shutting down server...")
#         await server.stop(5)
#         await connection.close()
#         print("RabbitMQ connection closed.")



# if __name__ == "__main__":
#     asyncio.run(serve())
import grpc
import asyncio
import os
import aio_pika
import json
import notification_pb2
import notification_pb2_grpc
import aiomysql
import datetime

RABBITMQ_URL = os.getenv("RABBITMQ_URL", "amqp://guest:guest@rabbitmq-notification/")
EMAIL_EXCHANGE =os.getenv("EMAIL_EXCHANGE", "email_exchange") 
EMAIL_QUEUE = os.getenv("EMAIL_QUEUE", "data_email_queue")

class AppointmentServiceServicer(notification_pb2_grpc.AppointmentServiceServicer):
    def __init__(self, channel: aio_pika.RobustChannel, db_pool):
        self.channel = channel
        self.db_pool = db_pool

    async def _publish_to_queue(self, message_body):
        exchange = await self.channel.get_exchange(EMAIL_EXCHANGE)
        await exchange.publish(
            aio_pika.Message(body=json.dumps(message_body).encode()),
            routing_key=""  # Fanout ignores this
        )

    async def SendReminder(self, request, context):
        payload = {
            "type": "reminder",
            "patientName": request.patientName,
            "patientEmail": request.patientEmail,
            "date": request.date,
            "startTime": request.startTime,
            "endTime": request.endTime,
            "doctorName": request.doctorName,
            "consultationFee": request.consultationFee,
        }
        await self._publish_to_queue(payload)
        return notification_pb2.AppointmentResponse(
            success=True,
            message="Email request queued successfully."
        )

    async def SendPrescriptionReady(self, request, context):
        payload = {
            "type": "prescription",
            "patientEmail": request.patientEmail
        }
        await self._publish_to_queue(payload)
        return notification_pb2.AppointmentResponse(
            success=True,
            message="Prescription email request queued successfully."
        )
    async def AddUser(self, request, context):
        query = """
        INSERT INTO logs.user (id, email, firstname, lastname, created_at)
        VALUES (%s, %s, %s, %s, NOW())
        """
        try:
            async with self.db_pool.acquire() as conn:
                async with conn.cursor() as cur:
                    await cur.execute(query, (
                        request.userid,
                        request.email,
                        request.firstname,
                        request.lastname
                    ))
            return notification_pb2.GenericResponse(message="User added successfully.")
        except Exception as e:
            return notification_pb2.GenericResponse(message=f"Error adding user: {str(e)}")
    async def BookAppointment(self, request, context):
        query = """
        INSERT INTO logs.appointments_tab (
            appointment_id, id, patient_id, doctor_id,
            appointment_date, start_time, end_time,
            status, notes, created_at, updated_at
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        try:
            async with self.db_pool.acquire() as conn:
                async with conn.cursor() as cur:
                    await cur.execute(query, (
                        request.appointmentId,
                        request.appointmentId,
                        request.patient,
                        request.doctor,
                        request.appointmentDate,
                        request.timeSlot.startTime,
                        request.timeSlot.endTime,
                        request.status,
                        request.notes,
                        request.createdAt,
                        request.updatedAt,
                    ))
            return notification_pb2.AnalysisAppointmentResponse(message="Appointment booked successfully.")
        except Exception as e:
            return notification_pb2.AnalysisAppointmentResponse(message=f"Error: {str(e)}")
    async def AcceptAppointment(self, request, context):
        try:
            async with self.db_pool.acquire() as conn:
                async with conn.cursor() as cur:
                    await cur.execute("CALL AcceptAppointment(%s)", (request.appointmentId,))
            return notification_pb2.GenericResponse(message="Appointment accepted.")
        except Exception as e:
            return notification_pb2.GenericResponse(message=f"Error accepting appointment: {str(e)}")
    async def GetUpcomingConfirmedAppointments(self, request, context):
        appointments_list = []
        async with self.db_pool.acquire() as conn:
            async with conn.cursor(aiomysql.DictCursor) as cursor:
                query = """
                SELECT
                    CONCAT(p_user.firstname, ' ', p_user.lastname) AS patientName,
                    p_user.email AS patientEmail,
                    DATE_FORMAT(ap.appointment_date, '%d/%m/%Y') AS date,
                    TIME_FORMAT(ap.start_time, '%H:%i') AS startTime,
                    TIME_FORMAT(ap.end_time, '%H:%i') AS endTime,
                    CONCAT(d_user.firstname, ' ', d_user.lastname) AS doctorName,
                    50000 AS consultationFee
                FROM
                    logs.appointments_tab AS ap
                JOIN
                    logs.user AS p_user ON ap.patient_id = p_user.id
                JOIN
                    logs.user AS d_user ON ap.doctor_id = d_user.id
                WHERE
                    ap.status = 'confirmed'
                    AND ap.appointment_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 3 DAY);
                """
                await cursor.execute(query)
                results = await cursor.fetchall()

                for row in results:
                    appointment_info = notification_pb2.AppointmentInfo(
                        patientName=row['patientName'],
                        patientEmail=row['patientEmail'],
                        date=row['date'],
                        startTime=row['startTime'],
                        endTime=row['endTime'],
                        doctorName=row['doctorName'],
                        consultationFee=row['consultationFee']
                    )
                    appointments_list.append(appointment_info)

        return notification_pb2.GetUpcomingConfirmedAppointmentsResponse(
            appointments=appointments_list
        )

async def main():
    connection = await aio_pika.connect_robust(RABBITMQ_URL)
    channel = await connection.channel()

    # Declare fanout exchange and bind queue without routing key
    await channel.declare_exchange(EMAIL_EXCHANGE, type='fanout', durable=True)
    await channel.declare_queue(EMAIL_QUEUE, durable=True)
    queue = await channel.get_queue(EMAIL_QUEUE)
    await queue.bind(EMAIL_EXCHANGE)  # No routing key for fanout

    db_pool = await aiomysql.create_pool(
        host=os.getenv("MYSQL_HOST", "mysql-notification"),
        port=int(os.getenv("MYSQL_PORT", 3306)),
        user=os.getenv("MYSQL_USER", "root"),
        password=os.getenv("MYSQL_PASSWORD", "root"),
        db=os.getenv("MYSQL_DATABASE", "logs"),
        autocommit=True
    )

    server = grpc.aio.server()
    servicer = AppointmentServiceServicer(channel, db_pool)
    notification_pb2_grpc.add_AppointmentServiceServicer_to_server(servicer, server)

    grpc_host = os.getenv("GRPC_HOST", "0.0.0.0")
    grpc_port = os.getenv("GRPC_PORT", "3006")
    server.add_insecure_port(f"{grpc_host}:{grpc_port}")


    await server.start()
    print(f"gRPC server running on {grpc_host}:{grpc_port} with RabbitMQ and MySQL.")

    try:
        await server.wait_for_termination()
    except asyncio.CancelledError:
        print("Server termination requested.")
    finally:
        print("Shutting down server...")
        await server.stop(5)
        await connection.close()
        db_pool.close()
        await db_pool.wait_closed()
        print("RabbitMQ and MySQL connections closed.")

if __name__ == "__main__":
    print("Server script starting...")
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        loop.run_until_complete(main())
    except KeyboardInterrupt:
        for task in asyncio.all_tasks(loop):
            task.cancel()
        loop.run_until_complete(asyncio.sleep(0.1))
    finally:
        loop.close()

