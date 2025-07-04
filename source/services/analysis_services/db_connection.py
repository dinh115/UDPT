import mysql.connector
from mysql.connector import Error

def get_db_connection():
    """Establishes and returns a new MySQL database connection."""
    try:
        conn = mysql.connector.connect(
            host="mysql-analysis",
            user="root",
            password="root",
            database="appointment_db"
        )
        return conn
    except Error as e:
        print(f"Error connecting to MySQL database: {e}")
        return None

def close_db_connection(conn, cursor=None):
    """Closes the database connection and cursor if they exist."""
    if cursor:
        cursor.close()
    if conn and conn.is_connected():
        conn.close()