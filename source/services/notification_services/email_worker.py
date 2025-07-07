import asyncio
import os
import json
import aiosmtplib
import aiomysql
from email.message import EmailMessage
import aio_pika

EMAIL_ADDRESS = os.getenv("EMAIL_ADDRESS", "pdai.congviec@gmail.com")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD", "ixouorzcsxgrsdeu")
MYSQL_CONFIG = {
    "host": os.getenv("MYSQL_HOST", "mysql-notification"),
    "port": int(os.getenv("MYSQL_PORT", 3306)),
    "user": os.getenv("MYSQL_USER", "root"),
    "password": os.getenv("MYSQL_PASSWORD", "root"),
    "db": os.getenv("MYSQL_DATABASE", "logs"),
    "autocommit": True
}

RABBITMQ_URL = os.getenv("RABBITMQ_URL","amqp://guest:guest@rabbitmq-notification/")
EMAIL_EXCHANGE = os.getenv("EMAIL_EXCHANGE","email_exchange")
EMAIL_QUEUE = os.getenv("EMAIL_QUEUE","data_email_queue")

async def send_email(payload):
    smtp = aiosmtplib.SMTP(hostname="smtp.gmail.com", port=465, use_tls=True)
    await smtp.connect()
    await smtp.login(EMAIL_ADDRESS, EMAIL_PASSWORD)

    msg = EmailMessage()
    msg["From"] = EMAIL_ADDRESS
    msg["To"] = payload["patientEmail"]

    if payload["type"] == "reminder":
        msg["Subject"] = "Thư nhắc lịch khám bệnh"
        msg.set_content(f"""
Kính gửi bệnh nhân {payload['patientName']},

Đây là thư nhắc nhở lịch khám bệnh với chi tiết như sau:

- Ngày: {payload['date']}
- Thời gian: {payload['startTime']} đến {payload['endTime']}
- Bác sĩ: {payload['doctorName']}
- Phí khám bệnh: {payload['consultationFee']} đồng

Vui lòng bệnh nhân hãy đến đúng giờ. Xin cảm ơn vì đã chọn dịch vụ của chúng tôi!

Trân trọng,
Bệnh viện ABC
""")
    else:
        msg["Subject"] = "Thông báo thuốc đã sẵn sàng"
        msg.set_content("""\
Kính gửi bệnh nhân,

Thuốc của bạn đã sẵn sàng. Vui lòng bạn đến quầy thuốc để nhận thuốc.

Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!

Trân trọng,
Bệnh viện ABC
""")
    try:
        await smtp.send_message(msg)
        return True, "Email sent"
    except Exception as e:
        return False, str(e)
    finally:
        await smtp.quit()

async def log_to_mysql(conn, payload, status, message):
    async with conn.cursor() as cursor:
        await cursor.execute(
            """
            INSERT INTO logs.email_logs (email, type, status, message)
            VALUES (%s, %s, %s, %s)
            """,
            (payload["patientEmail"], payload["type"], "success" if status else "failed", message)
        )

async def worker_loop(queue, db_pool):
    try:
        async with queue.iterator() as queue_iter:
            async for message in queue_iter:
                async with message.process():
                    payload = json.loads(message.body)
                    success, msg = await send_email(payload)
                    async with db_pool.acquire() as conn:
                        await log_to_mysql(conn, payload, success, msg)
                    print(f"Processed: {payload['type']} -> {msg}")
    except asyncio.CancelledError:
        print("Worker loop cancelled. Exiting gracefully.")

async def main():
    connection = await aio_pika.connect_robust(RABBITMQ_URL)
    async with connection:
        channel = await connection.channel()
        await channel.declare_exchange(EMAIL_EXCHANGE, type='fanout', durable=True)
        queue = await channel.declare_queue(EMAIL_QUEUE, durable=True)
        await queue.bind(EMAIL_EXCHANGE)
        db_pool = await aiomysql.create_pool(**MYSQL_CONFIG)
        worker_task = asyncio.create_task(worker_loop(queue, db_pool))
        try:
            await worker_task
        except asyncio.CancelledError:
            print("Main task cancelled. Cancelling worker...")
            worker_task.cancel()
            await asyncio.gather(worker_task, return_exceptions=True)
        finally:
            db_pool.close()
            await db_pool.wait_closed()
            print("MySQL and RabbitMQ connections closed.")

if __name__ == "__main__":
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


# async def worker_loop(queue, db_conn):
#     async with queue.iterator() as queue_iter:
#         async for message in queue_iter:
#             async with message.process():
#                 payload = json.loads(message.body)
#                 success, msg = await send_email(payload)
#                 await log_to_mysql(db_conn, payload, success, msg)
#                 print(f"Processed: {payload['type']} -> {msg}")

# async def main():
#     connection = await aio_pika.connect_robust(RABBITMQ_URL)
#     channel = await connection.channel()

#     await channel.declare_exchange(EMAIL_EXCHANGE, type='fanout', durable=True)
#     await channel.declare_queue(EMAIL_QUEUE, durable=True)
#     queue = await channel.get_queue(EMAIL_QUEUE)
#     await queue.bind(EMAIL_EXCHANGE)

#     # Persistent MySQL connection
#     db_conn = mysql.connector.connect(**MYSQL_CONFIG)

#     try:
#         await worker_loop(queue, db_conn)
#     except asyncio.CancelledError:
#         print("Worker shutdown requested.")
#     finally:
#         db_conn.close()
#         await connection.close()
#         print("MySQL and RabbitMQ connections closed.")

# if __name__ == "__main__":
#     loop = asyncio.new_event_loop()
#     asyncio.set_event_loop(loop)
#     try:
#         loop.run_until_complete(main())
#     except KeyboardInterrupt:
#         for task in asyncio.all_tasks(loop):
#             task.cancel()
#         loop.run_until_complete(asyncio.sleep(0.1))
#     finally:
#         loop.close()
