import pika
import json
import mysql.connector
from mysql.connector import Error
from datetime import datetime
## it should be activated, when the appointment is approved
EXCHANGE_NAME = "streaming_exchange"
QUEUE_NAME = "appointment_queue"
ROUTING_KEY_APPOINTMENT = "appointment"

# Global variables for MySQL connection
conn = None
cursor = None

def init_db_connection():
    global conn, cursor
    try:
        if conn is None or not conn.is_connected():
            conn = mysql.connector.connect(
                host="localhost",
                user="root",
                password="root",
                database="appointment_db"
            )
            cursor = conn.cursor()
    except Error as e:
        print("Error connecting to MySQL:", e)
        conn = None
        cursor = None

def callback(ch, method, properties, body):
    global conn, cursor
    data = json.loads(body)

    # Make sure DB connection is initialized
    init_db_connection()
    if conn is None or cursor is None:
        print("MySQL connection not available, skipping message.")
        return

    try:
        query = """
        INSERT INTO appointments_tab (
            appointment_id, patient_id, doctor_id, appointment_date, start_time, end_time,
            status, notes, created_at, updated_at
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """

        cursor.execute(query, (
            data["appointmentId"],
            data["patient"],
            data["doctor"],
            data["appointmentDate"][:10],
            data["timeSlot"]["startTime"],
            data["timeSlot"]["endTime"],
            data["status"],
            data["notes"],
            data["createdAt"].replace("T", " ").replace("Z", ""),
            data["updatedAt"].replace("T", " ").replace("Z", "")
        ))

        conn.commit()
        print("Inserted into MySQL")
    except Error as e:
        print("Failed to insert data:", e)

connection = pika.BlockingConnection(pika.ConnectionParameters("localhost"))
channel = connection.channel()

channel.exchange_declare(exchange=EXCHANGE_NAME, exchange_type="direct", durable=True)
channel.queue_declare(queue=QUEUE_NAME, durable=True)
channel.queue_bind(exchange=EXCHANGE_NAME, queue=QUEUE_NAME, routing_key=ROUTING_KEY_APPOINTMENT)

channel.basic_consume(queue=QUEUE_NAME, on_message_callback=callback, auto_ack=True)
print("Waiting for messages...")
try:
    channel.start_consuming()
except KeyboardInterrupt:
    print("Stopping...")
finally:
    if cursor:
        cursor.close()
    if conn:
        conn.close()
    if channel.is_open:
        channel.close()
    if connection.is_open:
        connection.close()
    print("Cleaned up connections.")