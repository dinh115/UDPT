import grpc
from app.grpc import patient_pb2, patient_pb2_grpc
from google.protobuf.timestamp_pb2 import Timestamp
from app.models import patient_repository as repo
from datetime import datetime

class PatientServiceHandler(patient_pb2_grpc.PatientServiceServicer):
    def _datetime_to_timestamp(self, dt):
        ts = Timestamp()
        ts.FromDatetime(dt)
        return ts

    async def GetVisit(self, request, context):
        doc = await repo.get_visit_by_id(request.id)
        if not doc:
            context.set_code(grpc.StatusCode.NOT_FOUND)
            context.set_details("Visit not found")
            return patient_pb2.GetVisitResponse()
        return patient_pb2.GetVisitResponse(visit=self._build_visit_message(doc))

    async def ListVisits(self, request, context):
        visits = await repo.get_visits_by_patient(request.patient)
        result = [self._build_visit_message(doc) for doc in visits]
        return patient_pb2.ListVisitsResponse(visits=result)

    async def CreateVisit(self, request, context):
        v = request.visit
        doc = {
            "patient": v.patient,
            "doctor": v.doctor,
            "visitDate": v.visitDate.ToDatetime(),
            "department": v.department,
            "reason_for_visit": v.reason_for_visit,
            "diagnosis": [
                {"code": d.code, "description": d.description} for d in v.diagnosis
            ],
            "vital_signs": {
                "temperature": v.vital_signs.temperature,
                "blood_pressure": v.vital_signs.blood_pressure,
                "pulse": v.vital_signs.pulse,
                "respiratory_rate": v.vital_signs.respiratory_rate,
                "weight": v.vital_signs.weight,
                "height": v.vital_signs.height,
            } if v.HasField("vital_signs") else None,
            "tests": [
                {
                    "name": t.name,
                    "result": t.result,
                    "date": t.date.ToDatetime(),
                    "file_url": t.file_url
                } for t in v.tests
            ],
            "symptoms": list(v.symptoms),
            "allergies": list(v.allergies),
            "prescription": v.prescription,
            "notes": v.notes,
        }
        inserted = await repo.create_visit_dict(doc)
        return patient_pb2.CreateVisitResponse(visit=self._build_visit_message(inserted))

    async def UpdateVisit(self, request, context):
        v = request.visit
        visit_id = request.id
        update_dict = {
            "visitDate": v.visitDate.ToDatetime(),
            "department": v.department,
            "reason_for_visit": v.reason_for_visit,
            "diagnosis": [
                {"code": d.code, "description": d.description} for d in v.diagnosis
            ],
            "vital_signs": {
                "temperature": v.vital_signs.temperature,
                "blood_pressure": v.vital_signs.blood_pressure,
                "pulse": v.vital_signs.pulse,
                "respiratory_rate": v.vital_signs.respiratory_rate,
                "weight": v.vital_signs.weight,
                "height": v.vital_signs.height,
            } if v.HasField("vital_signs") else None,
            "tests": [
                {
                    "name": t.name,
                    "result": t.result,
                    "date": t.date.ToDatetime(),
                    "file_url": t.file_url
                } for t in v.tests
            ],
            "symptoms": list(v.symptoms),
            "allergies": list(v.allergies),
            "prescription": v.prescription,
            "notes": v.notes,
        }
        updated = await repo.update_visit(visit_id, update_dict)
        if not updated:
            context.set_code(grpc.StatusCode.NOT_FOUND)
            context.set_details("Visit not found")
            return patient_pb2.CreateVisitResponse()
        return patient_pb2.CreateVisitResponse(visit=self._build_visit_message(updated))

    def _build_visit_message(self, doc):
        visit = patient_pb2.Visit(
            id=doc["_id"],
            patient=doc["patient"],
            doctor=doc["doctor"],
            visitDate=self._datetime_to_timestamp(doc["visitDate"]),
            department=doc.get("department", ""),
            reason_for_visit=doc.get("reason_for_visit", ""),
            notes=doc.get("notes", ""),
            prescription=doc.get("prescription", ""),
            diagnosis=[
                patient_pb2.Diagnosis(code=d.get("code", ""), description=d.get("description", ""))
                for d in doc.get("diagnosis", [])
            ],
            tests=[
                patient_pb2.TestResult(
                    name=t.get("name", ""),
                    result=t.get("result", ""),
                    date=self._datetime_to_timestamp(t.get("date", datetime.utcnow())),
                    file_url=t.get("file_url", "")
                ) for t in doc.get("tests", [])
            ],
            symptoms=doc.get("symptoms", []),
            allergies=doc.get("allergies", [])
        )

        vitals = doc.get("vital_signs")
        if vitals:
            visit.vital_signs.temperature = vitals.get("temperature", 0.0)
            visit.vital_signs.blood_pressure = vitals.get("blood_pressure", "")
            visit.vital_signs.pulse = vitals.get("pulse", 0)
            visit.vital_signs.respiratory_rate = vitals.get("respiratory_rate", 0)
            visit.vital_signs.weight = vitals.get("weight", 0.0)
            visit.vital_signs.height = vitals.get("height", 0.0)

        return visit

    async def Check(self, request, context):
        return patient_pb2.HealthCheckResponse(healthy=True)
