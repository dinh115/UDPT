import asyncio
import uvicorn
from app.grpc_server import serve as grpc_serve
from fastapi import FastAPI
from app.routes.patient_route import router

app = FastAPI(title="Patient Service")
app.include_router(router)

@app.get("/")
async def root():
    return {"message": "Patient visit service running."}

# parallel
# async def main():
#     # gRPC
#     grpc_server = await grpc_serve()
#     grpc_task = asyncio.create_task(grpc_server.wait_for_termination())

#     # FastAPI
#     config = uvicorn.Config(app, host="0.0.0.0", port=3001)
#     server = uvicorn.Server(config)
#     uvicorn_task = asyncio.create_task(server.serve())

#     try:
#         await asyncio.gather(grpc_task, uvicorn_task)
#     except asyncio.CancelledError:
#         print("Cancelled — Shutting down...")
#     finally:
#         await grpc_server.stop(grace=None)  # hoặc `grace=1` để đợi hoàn thành
#         print("gRPC server shutdown completed.")

# only gRPC
async def main():
    server = await grpc_serve()
    try:
        await server.wait_for_termination()
    except asyncio.CancelledError:
        print("Cancelled — Shutting down...")
    finally:
        await server.stop(grace=None)
        print("gRPC server shutdown completed.")


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("Exiting...")
