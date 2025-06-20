from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

class Patient(BaseModel):
    name: str
    age: int
    gender: str
    email: Optional[EmailStr] = None

class PatientInDB(Patient):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")

    class Config:
        validate_by_name = True
        json_encoders = {ObjectId: str}
