import asyncio
import grpc
from app.grpc_handler.patient_service import PatientServiceHandler
from app.grpc import patient_pb2_grpc

async def serve():
    server = grpc.aio.server()
    patient_pb2_grpc.add_PatientServiceServicer_to_server(PatientServiceHandler(), server)
    server.add_insecure_port("[::]:3001")
    await server.start()
    print("gRPC server running at 3001")
    await server.wait_for_termination()

if __name__ == "__main__":
    try:
        asyncio.run(serve())
    except KeyboardInterrupt:
        print("Shutting down...")