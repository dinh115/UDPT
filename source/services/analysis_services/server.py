import grpc
from concurrent import futures
import pika

import analysis_pb2
import analysis_pb2_grpc

from controllers.appointment_controller import AppointmentController
from controllers.prescription_controller import PrescriptionController
from controllers.statistics_controller import StatisticsController
from db_connection import get_db_connection, close_db_connection # Import utilities

EXCHANGE_NAME = "streaming_exchange"

class AnalysisServiceServicer(analysis_pb2_grpc.AnalysisService):
    def __init__(self, pika_channel):
        self.pika_channel = pika_channel
        # Controllers are instantiated once, models within them are also lightweight
        self.appointment_controller = AppointmentController(pika_channel)
        self.prescription_controller = PrescriptionController(pika_channel)
        self.statistics_controller = StatisticsController()

    def _process_request_with_db(self, db_operation_func, request):
        """Helper to manage DB connection lifecycle for each request."""
        conn = None
        cursor = None
        try:
            conn = get_db_connection()
            if conn is None:
                # Handle error if connection cannot be established
                return None, "Database connection failed"
            cursor = conn.cursor()
            result_message = db_operation_func(conn, cursor, request)
            return result_message, None
        except Exception as e:
            print(f"An error occurred during DB operation: {e}")
            return None, f"An internal server error occurred: {e}"
        finally:
            close_db_connection(conn, cursor)

    def BookAppointment(self, request, context):
        # BookAppointment sends a message, no direct DB interaction here, so no conn/cursor needed
        message = self.appointment_controller.book_appointment(request)
        return analysis_pb2.AnalysisAppointmentResponse(message=message)

    def BookPrescription(self, request, context):
        # BookPrescription sends a message, no direct DB interaction here, so no conn/cursor needed
        message = self.prescription_controller.book_prescription(request)
        return analysis_pb2.PrescriptionResponse(message=message)

    def UpdatePrescriptionStatus(self, request, context):
        # This currently sends a message to a consumer for DB update.
        # If it were to update directly, it would use _process_request_with_db
        # For now, it delegates to controller which still publishes to MQ
        message = self.prescription_controller.update_prescription_status(
            None, None, # No direct DB op from server for this, consumers handle
            request.prescriptionId,
            request.newStatus
        )
        return analysis_pb2.GenericResponse(message=message)

    def MarkPrescriptionPaid(self, request, context):
        # This currently sends a message to a consumer for DB update.
        # Similar to UpdatePrescriptionStatus, no direct DB op from server.
        message = self.prescription_controller.mark_prescription_paid(
            None, None, # No direct DB op from server for this, consumers handle
            request.prescriptionId
        )
        return analysis_pb2.GenericResponse(message=message)

    def GetPatientStatistics(self, request, context):
        conn = None
        cursor = None
        try:
            conn = get_db_connection()
            if conn is None:
                context.set_code(grpc.StatusCode.UNAVAILABLE)
                context.set_details("Database connection unavailable")
                return analysis_pb2.PatientStatisticsResponse()
            cursor = conn.cursor()
            stats = self.statistics_controller.get_patient_statistics(conn, cursor, request)
            return analysis_pb2.PatientStatisticsResponse(stats=stats)
        except Exception as e:
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details(f"Error fetching patient statistics: {e}")
            return analysis_pb2.PatientStatisticsResponse()
        finally:
            close_db_connection(conn, cursor)

    def GetPrescriptionStatistics(self, request, context):
        conn = None
        cursor = None
        try:
            conn = get_db_connection()
            if conn is None:
                context.set_code(grpc.StatusCode.UNAVAILABLE)
                context.set_details("Database connection unavailable")
                return analysis_pb2.PrescriptionStatisticsResponse()
            cursor = conn.cursor()
            stats = self.statistics_controller.get_prescription_statistics(conn, cursor, request)
            return analysis_pb2.PrescriptionStatisticsResponse(stats=stats)
        except Exception as e:
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details(f"Error fetching prescription statistics: {e}")
            return analysis_pb2.PrescriptionStatisticsResponse()
        finally:
            close_db_connection(conn, cursor)

    def AcceptAppointment(self, request, context):
        # This currently sends a message to a consumer for DB update.
        # Similar to other MQ-driven updates, no direct DB op from server for this part.
        message = self.appointment_controller.accept_appointment(
            None, None, # No direct DB op from server for this, consumers handle
            request.appointmentId
        )
        return analysis_pb2.GenericResponse(message=message)


def serve():
    connection = pika.BlockingConnection(pika.ConnectionParameters("rabbitmq"))
    channel = connection.channel()
    channel.exchange_declare(exchange=EXCHANGE_NAME, exchange_type="direct", durable=True)

    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    analysis_pb2_grpc.add_AnalysisServiceServicer_to_server(AnalysisServiceServicer(channel), server)
    server.add_insecure_port('[::]:3005')
    server.start()
    print("gRPC server is running on port 3005...")
    try:
        server.wait_for_termination()
    finally:
        channel.close()
        connection.close()

if __name__ == '__main__':
    serve()