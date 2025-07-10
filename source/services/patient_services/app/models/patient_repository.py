import uuid
from datetime import datetime
from typing import List, Optional
from motor.motor_asyncio import AsyncIOMotorCollection
from app.database.connection import get_collection

collection: AsyncIOMotorCollection = get_collection()

def generate_uuid() -> str:
    return str(uuid.uuid4())

async def create_visit_dict(data: dict) -> dict:
    visit_dict = data.copy()
    visit_dict["_id"] = generate_uuid()
    visit_dict["created_at"] = datetime.utcnow()
    visit_dict["updated_at"] = datetime.utcnow()
    await collection.insert_one(visit_dict)
    return visit_dict

async def update_visit(visit_id: str, update_data: dict) -> Optional[dict]:
    update_data["updated_at"] = datetime.utcnow()
    result = await collection.find_one_and_update(
        {"_id": visit_id},
        {"$set": update_data},
        return_document=True
    )
    return result

async def get_visit_by_id(visit_id: str) -> Optional[dict]:
    return await collection.find_one({"_id": visit_id})

async def get_visits_by_patient(patient_id: str, limit: int = 20, skip: int = 0) -> List[dict]:
    cursor = collection.find({"patient": patient_id}).skip(skip).limit(limit).sort("visitDate", -1)
    return await cursor.to_list(length=limit)
