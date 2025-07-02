from fastapi import HTTPException
from app.models.patient_model import (
    create_visit,
    get_visit_by_id,
    get_visits_by_patient,
    update_visit,
    delete_visit
)
from app.models.patient_schema import PatientVisitCreate, PatientVisitUpdate

async def create_visit_controller(data: PatientVisitCreate):
    return await create_visit(data)

async def get_my_visits_controller(patient_id: str):
    return await get_visits_by_patient(patient_id)

async def get_visit_controller(visit_id: str):
    visit = await get_visit_by_id(visit_id)
    if not visit:
        raise HTTPException(status_code=404, detail="Visit not found")
    return visit

async def update_visit_controller(visit_id: str, data: PatientVisitUpdate):
    updated = await update_visit(visit_id, data)
    if not updated:
        raise HTTPException(status_code=404, detail="Visit not found")
    return updated

async def delete_visit_controller(visit_id: str):
    success = await delete_visit(visit_id)
    if not success:
        raise HTTPException(status_code=404, detail="Visit not found")
    return {"message": "Visit deleted successfully"}
