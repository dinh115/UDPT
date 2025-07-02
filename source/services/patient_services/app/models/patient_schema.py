from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum
from uuid import UUID
from datetime import datetime

class VisitStatus(str, Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class Diagnosis(BaseModel):
    code: str
    description: str

class VitalSigns(BaseModel):
    temperature: float
    blood_pressure: str
    pulse: int
    respiratory_rate: int
    weight: float
    height: float

class TestResult(BaseModel):
    name: str
    result: str
    date: datetime
    file_url: Optional[str] = None

class PatientVisitBase(BaseModel):
    patient: UUID
    doctor: UUID
    visit_date: datetime
    department: str
    reason_for_visit: str
    diagnosis: Optional[List[Diagnosis]] = None
    vital_signs: Optional[VitalSigns] = None
    tests: Optional[List[TestResult]] = None
    notes: Optional[str] = None
    status: VisitStatus = VisitStatus.PENDING

class PatientVisitCreate(PatientVisitBase):
    pass

class PatientVisitUpdate(BaseModel):
    visit_date: Optional[datetime] = None
    department: Optional[str] = None
    reason_for_visit: Optional[str] = None
    diagnosis: Optional[List[Diagnosis]] = None
    vital_signs: Optional[VitalSigns] = None
    tests: Optional[List[TestResult]] = None
    notes: Optional[str] = None
    status: Optional[VisitStatus] = None

class PatientVisitOut(PatientVisitBase):
    id: UUID = Field(..., alias="_id")
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
        populate_by_name = True
