from fastapi import FastAPI
from app.routes.patient_route import router

app = FastAPI(title="Patient MongoDB Service")

app.include_router(router, prefix="/patients")
