# import grpc
# import asyncio
# import os
# import aio_pika
# import json
# import signal

# import notification_pb2
# import notification_pb2_grpc

# RABBITMQ_URL = os.getenv("RABBITMQ_URL", "amqp://guest:guest@localhost/")
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
#     server.add_insecure_port("[::]:50051")

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

RABBITMQ_URL = os.getenv("RABBITMQ_URL", "amqp://guest:guest@localhost/")
EMAIL_EXCHANGE =os.getenv("EMAIL_EXCHANGE", "email_exchange") 
EMAIL_QUEUE = os.getenv("EMAIL_QUEUE", "data_email_queue")

class AppointmentServiceServicer(notification_pb2_grpc.AppointmentServiceServicer):
    def __init__(self, channel: aio_pika.RobustChannel):
        self.channel = channel

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

async def main():
    connection = await aio_pika.connect_robust(RABBITMQ_URL)
    channel = await connection.channel()

    # Declare fanout exchange and bind queue without routing key
    await channel.declare_exchange(EMAIL_EXCHANGE, type='fanout', durable=True)
    await channel.declare_queue(EMAIL_QUEUE, durable=True)
    queue = await channel.get_queue(EMAIL_QUEUE)
    await queue.bind(EMAIL_EXCHANGE)  # No routing key for fanout

    server = grpc.aio.server()
    servicer = AppointmentServiceServicer(channel)
    notification_pb2_grpc.add_AppointmentServiceServicer_to_server(servicer, server)

    grpc_host = os.getenv("GRPC_HOST", "0.0.0.0")
    grpc_port = os.getenv("GRPC_PORT", "50055")
    server.add_insecure_port(f"{grpc_host}:{grpc_port}")


    await server.start()
    print(f"gRPC server running on {grpc_host}:{grpc_port} with RabbitMQ fanout exchange.")

    try:
        await server.wait_for_termination()
    except asyncio.CancelledError:
        print("Server termination requested.")
    finally:
        print("Shutting down server...")
        await server.stop(5)
        await connection.close()
        print("RabbitMQ connection closed.")

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

