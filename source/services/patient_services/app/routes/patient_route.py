from fastapi import APIRouter
from typing import List
from app.models.patient_schema import Patient, PatientInDB
from app.controllers import patient_controller as controller

router = APIRouter()

@router.get("/", response_model=List[PatientInDB])
async def get_patients():
    return await controller.get_patients_logic()

@router.get("/{id}", response_model=PatientInDB)
async def get_patient(id: str):
    return await controller.get_patient_logic(id)

@router.post("/", response_model=PatientInDB)
async def add_patient(patient: Patient):
    return await controller.create_patient_logic(patient)

@router.put("/{id}", response_model=PatientInDB)
async def update_patient(id: str, patient: Patient):
    return await controller.update_patient_logic(id, patient)

@router.delete("/{id}")
async def delete_patient(id: str):
    return await controller.delete_patient_logic(id)