import asyncio
import signal
import grpc
from app.grpc_handler.patient_service import PatientServiceHandler
from app.grpc import patient_pb2_grpc

async def serve():
    server = grpc.aio.server()
    patient_pb2_grpc.add_PatientServiceServicer_to_server(PatientServiceHandler(), server)
    listen_addr = '[::]:3003'
    server.add_insecure_port(listen_addr)
    await server.start()
    print("gRPC server running at 3003")

    # Wait for shutdown signal
    stop_event = asyncio.Event()

    def shutdown():
        print("Stopping gRPC server...")
        stop_event.set()

    loop = asyncio.get_running_loop()
    loop.add_signal_handler(signal.SIGTERM, shutdown)
    loop.add_signal_handler(signal.SIGINT, shutdown)

    await stop_event.wait()
    await server.stop(grace=3)  # Wait max 3 seconds for graceful shutdown
    await server.wait_for_termination()
    print("Server shutdown complete.")

if __name__ == '__main__':
    asyncio.run(serve())
