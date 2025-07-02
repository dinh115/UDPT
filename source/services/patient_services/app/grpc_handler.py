import grpc
from app import patient_pb2, patient_pb2_grpc
from app.database.connection import get_collection
from bson.objectid import ObjectId

class PatientServiceHandler(patient_pb2_grpc.PatientServiceServicer):
    async def GetVisitHistory(self, request, context):
        patient_id = request.patient_id
        collection = get_collection()

        visits_cursor = collection.find({"patient": patient_id})
        visits = []
        async for visit in visits_cursor:
            visits.append(
                patient_pb2.Visit(
                    visit_id=str(visit.get("_id")),
                    department=visit.get("department", ""),
                    visit_date=str(visit.get("visit_date")),
                    reason_for_visit=visit.get("reason_for_visit", ""),
                    diagnosis=visit.get("diagnosis", [{}])[0].get("description", "")
                )
            )

        return patient_pb2.VisitHistoryResponse(visits=visits)

    async def GetPatientInfo(self, request, context):
        # Giả sử: bạn có collection user/benhnhan tên là patient_info
        patient_id = request.patient_id
        collection = get_collection("patient_info")

        doc = await collection.find_one({"_id": patient_id})
        if not doc:
            context.set_code(grpc.StatusCode.NOT_FOUND)
            context.set_details("Patient not found")
            return patient_pb2.PatientInfoResponse()

        return patient_pb2.PatientInfoResponse(
            patient_id=doc["_id"],
            name=doc.get("name", ""),
            email=doc.get("email", ""),
            phone=doc.get("phone", "")
        )
