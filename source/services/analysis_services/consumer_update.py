import pika
import json
import mysql.connector
from mysql.connector import Error

EXCHANGE_NAME = "streaming_exchange"
QUEUE_NAME = "appointment_update_queue"
ROUTING_KEY = "appointment_update"

def init_db_connection():
    try:
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="root",
            database="appointment_db"
        )
        return conn
    except Error as e:
        print("DB connection failed:", e)
        return None

def callback(ch, method, properties, body):
    data = json.loads(body)
    if data.get("command") != "acceptAppointment":
        print("Unknown command, skipping.")
        return

    appointment_id = data.get("appointmentId")
    if not appointment_id:
        print("Missing appointmentId in message.")
        return

    conn = init_db_connection()
    if conn is None:
        return

    try:
        cursor = conn.cursor()
        cursor.callproc("AcceptAppointment", [appointment_id])
        conn.commit()
        print(f"Stored procedure AcceptAppointment called for ID: {appointment_id}")
    except Error as e:
        print("Error during stored procedure call:", e)
    finally:
        cursor.close()
        conn.close()

# Setup RabbitMQ
connection = pika.BlockingConnection(pika.ConnectionParameters("localhost"))
channel = connection.channel()

channel.exchange_declare(exchange=EXCHANGE_NAME, exchange_type="direct", durable=True)
channel.queue_declare(queue=QUEUE_NAME, durable=True)
channel.queue_bind(exchange=EXCHANGE_NAME, queue=QUEUE_NAME, routing_key=ROUTING_KEY)

channel.basic_consume(queue=QUEUE_NAME, on_message_callback=callback, auto_ack=True)

print("Waiting for appointment update messages...")
try:
    channel.start_consuming()
except KeyboardInterrupt:
    print("Stopping...")
finally:
    if channel.is_open:
        channel.close()
    if connection.is_open:
        connection.close()
    print("Consumer update stopped.")
