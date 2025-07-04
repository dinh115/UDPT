import pika
import json
import mysql.connector
from mysql.connector import Error
import os
EXCHANGE_NAME = "streaming_exchange"
QUEUE_NAME = "prescription_updated_queue"
ROUTING_KEY_PRESCRIPTION_UPDATE = "prescription_update"

# Global MySQL connection and cursor
conn = None
cursor = None

def init_db_connection():
    global conn, cursor
    try:
        if conn is None or not conn.is_connected():
            conn = mysql.connector.connect(
                host=os.getenv("MYSQL_HOST", "localhost"),
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
    command = data.get("command")
    prescription_id = data["prescriptionId"]
    updated_at = data["updatedAt"].replace("T", " ").replace("Z", "")

    init_db_connection()
    if conn is None or cursor is None:
        print("MySQL connection not available. Skipping message.")
        return

    try:
        if command == "updateStatus":
            query = """
            UPDATE appointment_db.prescription
            SET status = %s, updated_at = %s
            WHERE prescription_id = %s
            """
            cursor.execute(query, (data["newStatus"], updated_at, prescription_id))
            print(f"Updated prescription status to {data['newStatus']} for {prescription_id}")

        elif command == "updatePaidStatus":
            query = """
            UPDATE appointment_db.prescription
            SET is_paid = %s, updated_at = %s
            WHERE prescription_id = %s
            """
            cursor.execute(query, (True, updated_at, prescription_id))
            print(f"Marked prescription as paid for {prescription_id}")

        else:
            print("Unknown command received.")

        conn.commit()
    except Error as e:
        print("Failed to update prescription:", e)

connection = pika.BlockingConnection(pika.ConnectionParameters(os.getenv("RABBITMQ_HOST", "localhost")))
channel = connection.channel()

channel.exchange_declare(exchange=EXCHANGE_NAME, exchange_type="direct", durable=True)
channel.queue_declare(queue=QUEUE_NAME, durable=True)
channel.queue_bind(exchange=EXCHANGE_NAME, queue=QUEUE_NAME, routing_key=ROUTING_KEY_PRESCRIPTION_UPDATE)

channel.basic_consume(queue=QUEUE_NAME, on_message_callback=callback, auto_ack=True)

print("Waiting for prescription update messages...")
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