from fastapi import FastAPI
from app.routes.patient_route import router

app = FastAPI(title="Patient Service") 

app.include_router(router)

@app.get("/")
async def root():
    return {"message": "Patient visit service running."}
