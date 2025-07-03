import grpc
from concurrent import futures
import analysis_pb2
import analysis_pb2_grpc
import pika
import json
from datetime import datetime, timezone
import statistics_handler
EXCHANGE_NAME = "streaming_exchange"
ROUTING_KEY_APPOINTMENT = "appointment"
ROUTING_KEY_PRESCRIPTION = "prescription"
class AnalysisServiceServicer(analysis_pb2_grpc.AnalysisService):
    def __init__(self, channel):
        self.channel = channel
    def BookAppointment(self, request, context):
        # Convert request to dict
        data = {
            "appointmentId": request.appointmentId,
            "patient": request.patient,
            "doctor": request.doctor,
            "appointmentDate": request.appointmentDate,
            "timeSlot": {
                "startTime": request.timeSlot.startTime,
                "endTime": request.timeSlot.endTime
            },
            "status": request.status,
            "notes": request.notes,
            "createdAt": request.createdAt,
            "updatedAt": request.updatedAt
        }
        message = json.dumps(data)
        self.channel.basic_publish(exchange=EXCHANGE_NAME, routing_key=ROUTING_KEY_APPOINTMENT, body=message)

        return analysis_pb2.AnalysisAppointmentResponse(message="Appointment message sent")
    def BookPrescription(self, request, context):
        data = {
            "prescriptionId": request.prescriptionId,
            "medicalRecordId": request.medicalRecordId,
            "totalCost": request.totalCost,
            "status": request.status,
            "isPaid": request.isPaid,
            "createdAt": request.createdAt,
            "updatedAt": request.updatedAt
        }
        message = json.dumps(data)
        self.channel.basic_publish(exchange=EXCHANGE_NAME, routing_key=ROUTING_KEY_PRESCRIPTION, body=message)
        return analysis_pb2.PrescriptionResponse(message="Prescription message sent successfully")
    def UpdatePrescriptionStatus(self, request, context):
        data = {
            "command": "updateStatus",
            "prescriptionId": request.prescriptionId,
            "newStatus": request.newStatus,
            "updatedAt": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
        }
        message = json.dumps(data)
        self.channel.basic_publish(
            exchange="streaming_exchange",
            routing_key="prescription_update",
            body=message
        )
        return analysis_pb2.GenericResponse(message="Prescription status update sent")

    def MarkPrescriptionPaid(self, request, context):
        data = {
            "command": "updatePaidStatus",
            "prescriptionId": request.prescriptionId,
            "updatedAt": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
        }
        message = json.dumps(data)
        self.channel.basic_publish(
            exchange="streaming_exchange",
            routing_key="prescription_update",
            body=message
        )
        return analysis_pb2.GenericResponse(message="Prescription paid update sent")
    def GetPatientStatistics(self, request, context):
        results = statistics_handler.get_patient_statistics(
            request.startDate, request.endDate, request.groupType
        )
        stats = [
            analysis_pb2.PatientStatisticsResponse.Stat(
                label=stat["label"], patientCount=stat["patient_count"]
            ) for stat in results
        ]
        return analysis_pb2.PatientStatisticsResponse(stats=stats)
    def GetPrescriptionStatistics(self, request, context):
        results = statistics_handler.get_prescription_statistics(
            request.startDate, request.endDate, request.groupType
        )
        stats = [
            analysis_pb2.PrescriptionStatisticsResponse.Stat(
                label=stat["label"],
                prescriptionCount=stat["prescription_count"]
            ) for stat in results
        ]
        return analysis_pb2.PrescriptionStatisticsResponse(stats=stats)
    def AcceptAppointment(self, request, context):
        data = {
            "command": "acceptAppointment",
            "appointmentId": request.appointmentId
        }
        message = json.dumps(data)
        self.channel.basic_publish(
            exchange=EXCHANGE_NAME,
            routing_key="appointment_update",
            body=message
        )
        return analysis_pb2.GenericResponse(message="AcceptAppointment command sent")
def serve():
    connection = pika.BlockingConnection(pika.ConnectionParameters("localhost"))
    channel = connection.channel()
    # channel.exchange_declare(exchange="data_exchange", exchange_type="fanout", durable=True)
    # channel.exchange_declare(exchange="analysis_exchange", exchange_type="fanout", durable=True)
    # Declare single direct exchange
    channel.exchange_declare(exchange="streaming_exchange", exchange_type="direct", durable=True)
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    analysis_pb2_grpc.add_AnalysisServiceServicer_to_server(AnalysisServiceServicer(channel), server)
    server.add_insecure_port('[::]:50051')
    server.start()
    print("gRPC server is running on port 50051...")
    try:
        server.wait_for_termination()
    finally:
        connection.close()
        print("RabbitMQ connection closed.")

if __name__ == "__main__":
    serve()
