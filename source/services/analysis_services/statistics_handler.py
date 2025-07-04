import mysql.connector
from mysql.connector import Error
import os
def get_patient_statistics(start_date, end_date, group_type):
  try:
    conn = mysql.connector.connect(
      host=os.getenv("MYSQL_HOST", "mysql-analysis"),
      user=os.getenv("MYSQL_USER", "root"),
      password=os.getenv("MYSQL_USER", "root"),
      database=os.getenv("MYSQL_DATABASE", "appointment_db")
    )
    cursor = conn.cursor()
    if group_type == 0: # BY_DATE
      query = """
        SELECT appointment_date AS label, COUNT(DISTINCT patient_id) AS patient_count
        FROM appointment_db.appointments_tab
        WHERE appointment_date BETWEEN %s AND %s
        GROUP BY appointment_date
        ORDER BY appointment_date
      """
    elif group_type == 1: # BY_MONTH
      query = """
        SELECT label, COUNT(DISTINCT patient_id) AS patient_count
        FROM (
          SELECT CONCAT(YEAR(appointment_date), '-', LPAD(MONTH(appointment_date),2,'0')) AS label, patient_id
          FROM appointment_db.appointments_tab
          WHERE appointment_date BETWEEN %s AND %s
        ) AS sub
        GROUP BY label
        ORDER BY label
      """
    else: # BY_YEAR
      query = """
        SELECT YEAR(appointment_date) AS label, COUNT(DISTINCT patient_id) AS patient_count
        FROM appointment_db.appointments_tab
        WHERE appointment_date BETWEEN %s AND %s
        GROUP BY YEAR(appointment_date)
        ORDER BY YEAR(appointment_date)
      """
    cursor.execute(query, (start_date, end_date))
    results = [{"label": str(row[0]), "patient_count": row[1]} for row in cursor.fetchall()]
    cursor.close()
    conn.close()
    return results
  except Error as e:
    print("MySQL error:", e)
    return []
 
def get_prescription_statistics(start_date, end_date, group_type):
  try:
    conn = mysql.connector.connect(
      host=os.getenv("MYSQL_HOST", "mysql-analysis"),
      user=os.getenv("MYSQL_USER", "root"),
      password=os.getenv("MYSQL_USER", "root"),
      database=os.getenv("MYSQL_DATABASE", "appointment_db")
    )
    cursor = conn.cursor()
    if group_type == 0: # BY_DATE
      query = """
        SELECT DATE(created_at) AS label, COUNT(*) AS prescription_count
        FROM appointment_db.prescription
        WHERE is_deleted = FALSE
         AND status IN ('APPROVED', 'COMPLETED')
         AND DATE(created_at) BETWEEN %s AND %s
        GROUP BY DATE(created_at)
        ORDER BY DATE(created_at)
      """
    elif group_type == 1: # BY_MONTH
      query = """
      SELECT label, COUNT(*) AS prescription_count
      FROM (
        SELECT
          CONCAT(YEAR(created_at), '-', LPAD(MONTH(created_at), 2, '0')) AS label
        FROM appointment_db.prescription
        WHERE is_deleted = FALSE
        AND status IN ('APPROVED', 'COMPLETED')
        AND DATE(created_at) BETWEEN %s AND %s
      ) AS sub
      GROUP BY label
      ORDER BY label
      """
    else: # BY_YEAR
      query = """
        SELECT YEAR(created_at) AS label, COUNT(*) AS prescription_count
        FROM appointment_db.prescription
        WHERE is_deleted = FALSE
         AND status IN ('APPROVED', 'COMPLETED')
         AND DATE(created_at) BETWEEN %s AND %s
        GROUP BY YEAR(created_at)
        ORDER BY label
      """
    cursor.execute(query, (start_date, end_date))
    results = [{"label": str(row[0]), "prescription_count": row[1]} for row in cursor.fetchall()]
    cursor.close()
    conn.close()
    return results
  except Error as e:
    print("MySQL error:", e)
    return []