import pika
import json
import mysql.connector
from mysql.connector import Error
import os
EXCHANGE_NAME = "streaming_exchange"
QUEUE_NAME = "prescription_queue"
ROUTING_KEY_PRESCRIPTION = "prescription"

# Global variables for MySQL connection
conn = None
cursor = None

def init_db_connection():
    global conn, cursor
    try:
        if conn is None or not conn.is_connected():
            conn = mysql.connector.connect(
                host=os.getenv("MYSQL_HOST", "mysql-analysis"),
                user=os.getenv("MYSQL_USER", "root"),
                password=os.getenv("MYSQL_PASSWORD", "root"),
                database=os.getenv("MYSQL_DATABASE", "appointment_db")
            )
            cursor = conn.cursor()
    except Error as e:
        print("Error connecting to MySQL:", e)
        conn = None
        cursor = None

def callback(ch, method, properties, body):
    global conn, cursor
    data = json.loads(body)

    init_db_connection()
    if conn is None or cursor is None:
        print("MySQL connection not available, skipping message.")
        return

    try:
        query = """
        INSERT INTO appointment_db.prescription (
            prescription_id, medical_record_id, total_cost, status,
            is_paid, created_at, updated_at
        ) VALUES (%s, %s, %s, %s, %s, %s, %s)
        """

        cursor.execute(query, (
            data["prescriptionId"],
            data["medicalRecordId"],
            data["totalCost"],
            data["status"],
            data["isPaid"],
            data["createdAt"].replace("T", " ").replace("Z", ""),
            data["updatedAt"].replace("T", " ").replace("Z", "")
        ))

        conn.commit()
        print("Prescription inserted into MySQL")
    except Error as e:
        print("Failed to insert prescription:", e)

# Set up RabbitMQ
connection = pika.BlockingConnection(pika.ConnectionParameters(os.getenv("RABBITMQ_HOST", "rabbitmq-analysis")))
channel = connection.channel()

channel.exchange_declare(exchange=EXCHANGE_NAME, exchange_type="direct", durable=True)
channel.queue_declare(queue=QUEUE_NAME, durable=True)
channel.queue_bind(exchange=EXCHANGE_NAME, queue=QUEUE_NAME, routing_key=ROUTING_KEY_PRESCRIPTION)

channel.basic_consume(queue=QUEUE_NAME, on_message_callback=callback, auto_ack=True)

print("Waiting for prescription messages...")
try:
    channel.start_consuming()
except KeyboardInterrupt:
    print("Stopping...")
finally:
    # Cleanup
    if cursor:
        cursor.close()
    if conn:
        conn.close()
    if channel.is_open:
        channel.close()
    if connection.is_open:
        connection.close()
    print("Cleaned up MySQL and RabbitMQ connections.")
