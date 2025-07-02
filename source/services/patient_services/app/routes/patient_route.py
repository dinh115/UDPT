from fastapi import APIRouter, Depends
from app.models.patient_schema import PatientVisitCreate, PatientVisitUpdate, PatientVisitOut
from app.controllers import patient_controller as controller
from typing import List

router = APIRouter(prefix="/patient-visits", tags=["Patient Visits"])

@router.post("/", response_model=PatientVisitOut)
async def create_visit_route(data: PatientVisitCreate):
    return await controller.create_visit_controller(data)

@router.get("/user/{patient_id}", response_model=List[PatientVisitOut])
async def get_my_visits_route(patient_id: str):
    return await controller.get_my_visits_controller(patient_id)

@router.get("/{visit_id}", response_model=PatientVisitOut)
async def get_visit_route(visit_id: str):
    return await controller.get_visit_controller(visit_id)

@router.put("/{visit_id}", response_model=PatientVisitOut)
async def update_visit_route(visit_id: str, data: PatientVisitUpdate):
    return await controller.update_visit_controller(visit_id, data)

@router.delete("/{visit_id}")
async def delete_visit_route(visit_id: str):
    return await controller.delete_visit_controller(visit_id)