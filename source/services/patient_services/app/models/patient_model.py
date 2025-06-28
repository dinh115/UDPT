import uuid
from datetime import datetime, timezone
from typing import List, Optional
from motor.motor_asyncio import AsyncIOMotorCollection
from app.database.connection import db
from app.models.patient_schema import (
    PatientVisitCreate,
    PatientVisitUpdate,
    PatientVisitOut
)

collection: AsyncIOMotorCollection = db["patient_visits"]

def generate_uuid() -> str:
    return str(uuid.uuid4())

async def create_visit(data: PatientVisitCreate) -> PatientVisitOut:
    visit_dict = data.model_dump()
    visit_dict["_id"] = generate_uuid()
    visit_dict["created_at"] = datetime.now(timezone.utc)
    visit_dict["updated_at"] = datetime.now(timezone.utc)

    # Convert UUIDs to strings for MongoDB compatibility
    visit_dict["patient"] = str(visit_dict["patient"])
    visit_dict["doctor"] = str(visit_dict["doctor"])

    await collection.insert_one(visit_dict)
    return PatientVisitOut(**visit_dict)

async def get_visit_by_id(visit_id: str) -> Optional[PatientVisitOut]:
    doc = await collection.find_one({"_id": visit_id})
    return PatientVisitOut(**doc) if doc else None

async def get_visits_by_patient(patient_id: str, limit: int = 20, skip: int = 0) -> List[PatientVisitOut]:
    cursor = collection.find({"patient": patient_id}).skip(skip).limit(limit).sort("visit_date", -1)
    visits = await cursor.to_list(length=limit)
    return [PatientVisitOut(**v) for v in visits]

async def update_visit(visit_id: str, update_data: PatientVisitUpdate) -> Optional[PatientVisitOut]:
    update_dict = {k: v for k, v in update_data.model_dump(exclude_unset=True).items()}
    if update_dict:
        update_dict["updated_at"] = datetime.utcnow()
        result = await collection.find_one_and_update(
            {"_id": visit_id},
            {"$set": update_dict},
            return_document=True
        )
        return PatientVisitOut(**result) if result else None
    return None

async def delete_visit(visit_id: str) -> bool:
    result = await collection.delete_one({"_id": visit_id})
    return result.deleted_count == 1
