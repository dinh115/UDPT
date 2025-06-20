from app.database.connection import db
from app.models.patient_schema import Patient, PatientInDB
from bson import ObjectId

collection = db["patients"]

async def get_all_patients():
    return [PatientInDB(**doc) async for doc in collection.find()]

async def get_patient_by_id(id: str):
    doc = await collection.find_one({"_id": ObjectId(id)})
    return PatientInDB(**doc) if doc else None

async def get_patient_by_email(email: str):
    doc = await collection.find_one({"email": email})
    return PatientInDB(**doc) if doc else None

async def insert_patient(patient: Patient):
    result = await collection.insert_one(patient.dict())
    return str(result.inserted_id)

async def update_patient(id: str, patient: Patient):
    await collection.update_one({"_id": ObjectId(id)}, {"$set": patient.dict()})
    return await get_patient_by_id(id)

async def delete_patient(id: str):
    result = await collection.delete_one({"_id": ObjectId(id)})
    return result.deleted_count