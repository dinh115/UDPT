import grpc
from . import patient_pb2_grpc
from app.grpc_handler import PatientServiceHandler

async def serve():
    server = grpc.aio.server()
    patient_pb2_grpc.add_PatientServiceServicer_to_server(
        PatientServiceHandler(), server
    )
    server.add_insecure_port("[::]:50051")
    await server.start()
    print("gRPC server listening on port 50051")

    return server
