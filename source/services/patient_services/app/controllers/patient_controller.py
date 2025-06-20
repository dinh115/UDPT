from app.models import patient_model as model
from app.models.patient_schema import Patient
from fastapi import HTTPException

async def get_patients_logic():
    return await model.get_all_patients()

async def get_patient_logic(id: str):
    patient = await model.get_patient_by_id(id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient

async def create_patient_logic(patient: Patient):
    existing = await model.get_patient_by_email(patient.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")
    await model.insert_patient(patient)
    return await model.get_patient_by_email(patient.email)

async def update_patient_logic(id: str, patient: Patient):
    existing = await model.get_patient_by_id(id)
    if not existing:
        raise HTTPException(status_code=404, detail="Patient not found")
    return await model.update_patient(id, patient)

async def delete_patient_logic(id: str):
    deleted = await model.delete_patient(id)
    if deleted == 0:
        raise HTTPException(status_code=404, detail="Patient not found")
    return {"message": "Patient deleted"}