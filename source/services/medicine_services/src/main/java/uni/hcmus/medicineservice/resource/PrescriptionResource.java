package uni.hcmus.medicineservice.resource;

import io.grpc.stub.StreamObserver;
import lombok.RequiredArgsConstructor;
import net.devh.boot.grpc.server.service.GrpcService;
import uni.hcmus.medicineservice.prescription.service.PrescriptionService;
import uni.hcmus.medicineservice.prescription.model.dto.CreatePrescriptionRequest;
import uni.hcmus.medicineservice.prescription.model.dto.UpdatePrescriptionRequest;
import uni.hcmus.medicineservice.prescription.model.dto.PrescriptionResponse;
import uni.hcmus.medicineservice.prescription.model.dto.CreatePrescriptionItemRequest;
import uni.hcmus.medicineservice.prescription.model.dto.UpdatePrescriptionItemRequest;
import uni.hcmus.medicineservice.prescription.model.dto.PrescriptionItemResponse;
import uni.hcmus.medicineservice.grpc.PrescriptionServiceGrpc;
import uni.hcmus.medicineservice.grpc.Empty;
import uni.hcmus.medicineservice.grpc.PrescriptionListResponse;
import uni.hcmus.medicineservice.grpc.PrescriptionIdRequest;

import java.util.stream.Collectors;

@GrpcService
@RequiredArgsConstructor
public class PrescriptionResource extends PrescriptionServiceGrpc.PrescriptionServiceImplBase {

    private final PrescriptionService prescriptionService;

    @Override
    public void getAllPrescriptions(Empty request, StreamObserver<PrescriptionListResponse> responseObserver) {
        var prescriptions = prescriptionService.getAllPrescriptions();
        var responseBuilder = PrescriptionListResponse.newBuilder();
        
        for (PrescriptionResponse p : prescriptions) {
            var prescriptionBuilder = uni.hcmus.medicineservice.grpc.PrescriptionResponse.newBuilder()
                .setPrescriptionId(p.getPrescriptionId())
                .setMedicalRecordId(p.getMedicalRecordId())
                .setTotalCost(p.getTotalCost())
                .setStatus(p.getStatus() != null ? p.getStatus().name() : "")
                .setIsPaid(p.getIsPaid())
                .setCreatedAt(p.getCreatedAt() != null ? p.getCreatedAt().toString() : "")
                .setUpdatedAt(p.getUpdatedAt() != null ? p.getUpdatedAt().toString() : "");
            
            // Add prescription items
            for (PrescriptionItemResponse item : p.getItems()) {
                prescriptionBuilder.addItems(
                    uni.hcmus.medicineservice.grpc.PrescriptionItemResponse.newBuilder()
                        .setPrescriptionItemId(item.getPrescriptionItemId())
                        .setMedicine(
                            uni.hcmus.medicineservice.grpc.MedicineResponse.newBuilder()
                                .setMedicineId(item.getMedicine().getMedicineId())
                                .setName(item.getMedicine().getName())
                                .setUnit(item.getMedicine().getUnit())
                                .setSupplier(item.getMedicine().getSupplier())
                                .setPrice(item.getMedicine().getPrice())
                                .setStockQuantity(item.getMedicine().getStockQuantity())
                                .setCreatedAt(item.getMedicine().getCreatedAt() != null ? item.getMedicine().getCreatedAt().toString() : "")
                                .setUpdatedAt(item.getMedicine().getUpdatedAt() != null ? item.getMedicine().getUpdatedAt().toString() : "")
                                .build()
                        )
                        .setQuantity(item.getQuantity())
                        .setDosageInstruction(item.getDosageInstruction())
                        .setTotalCost(item.getTotalCost())
                        .build()
                );
            }
            
            responseBuilder.addPrescriptions(prescriptionBuilder.build());
        }
        
        responseObserver.onNext(responseBuilder.build());
        responseObserver.onCompleted();
    }

    @Override
    public void getPrescriptionById(PrescriptionIdRequest request, StreamObserver<uni.hcmus.medicineservice.grpc.PrescriptionResponse> responseObserver) {
        PrescriptionResponse p = prescriptionService.getPrescriptionById(request.getPrescriptionId());
        
        var prescriptionBuilder = uni.hcmus.medicineservice.grpc.PrescriptionResponse.newBuilder()
            .setPrescriptionId(p.getPrescriptionId())
            .setMedicalRecordId(p.getMedicalRecordId())
            .setTotalCost(p.getTotalCost())
            .setStatus(p.getStatus() != null ? p.getStatus().name() : "")
            .setIsPaid(p.getIsPaid())
            .setCreatedAt(p.getCreatedAt() != null ? p.getCreatedAt().toString() : "")
            .setUpdatedAt(p.getUpdatedAt() != null ? p.getUpdatedAt().toString() : "");
        
        // Add prescription items
        for (PrescriptionItemResponse item : p.getItems()) {
            prescriptionBuilder.addItems(
                uni.hcmus.medicineservice.grpc.PrescriptionItemResponse.newBuilder()
                    .setPrescriptionItemId(item.getPrescriptionItemId())
                    .setMedicine(
                        uni.hcmus.medicineservice.grpc.MedicineResponse.newBuilder()
                            .setMedicineId(item.getMedicine().getMedicineId())
                            .setName(item.getMedicine().getName())
                            .setUnit(item.getMedicine().getUnit())
                            .setSupplier(item.getMedicine().getSupplier())
                            .setPrice(item.getMedicine().getPrice())
                            .setStockQuantity(item.getMedicine().getStockQuantity())
                            .setCreatedAt(item.getMedicine().getCreatedAt() != null ? item.getMedicine().getCreatedAt().toString() : "")
                            .setUpdatedAt(item.getMedicine().getUpdatedAt() != null ? item.getMedicine().getUpdatedAt().toString() : "")
                            .build()
                    )
                    .setQuantity(item.getQuantity())
                    .setDosageInstruction(item.getDosageInstruction())
                    .setTotalCost(item.getTotalCost())
                    .build()
            );
        }
        
        responseObserver.onNext(prescriptionBuilder.build());
        responseObserver.onCompleted();
    }

    @Override
    public void createPrescription(uni.hcmus.medicineservice.grpc.CreatePrescriptionRequest request, StreamObserver<uni.hcmus.medicineservice.grpc.PrescriptionResponse> responseObserver) {
        // Convert proto items to DTO items
        var itemRequests = request.getItemsList().stream()
            .map(item -> new CreatePrescriptionItemRequest(
                item.getMedicineId(),
                item.getQuantity(),
                item.getDosageInstruction()
            ))
            .collect(Collectors.toList());
        
        CreatePrescriptionRequest createRequest = new CreatePrescriptionRequest(
            request.getMedicalRecordId(),
            itemRequests
        );
        
        PrescriptionResponse p = prescriptionService.createPrescription(createRequest);
        
        var prescriptionBuilder = uni.hcmus.medicineservice.grpc.PrescriptionResponse.newBuilder()
            .setPrescriptionId(p.getPrescriptionId())
            .setMedicalRecordId(p.getMedicalRecordId())
            .setTotalCost(p.getTotalCost())
            .setStatus(p.getStatus() != null ? p.getStatus().name() : "")
            .setIsPaid(p.getIsPaid())
            .setCreatedAt(p.getCreatedAt() != null ? p.getCreatedAt().toString() : "")
            .setUpdatedAt(p.getUpdatedAt() != null ? p.getUpdatedAt().toString() : "");
        
        // Add prescription items
        for (PrescriptionItemResponse item : p.getItems()) {
            prescriptionBuilder.addItems(
                uni.hcmus.medicineservice.grpc.PrescriptionItemResponse.newBuilder()
                    .setPrescriptionItemId(item.getPrescriptionItemId())
                    .setMedicine(
                        uni.hcmus.medicineservice.grpc.MedicineResponse.newBuilder()
                            .setMedicineId(item.getMedicine().getMedicineId())
                            .setName(item.getMedicine().getName())
                            .setUnit(item.getMedicine().getUnit())
                            .setSupplier(item.getMedicine().getSupplier())
                            .setPrice(item.getMedicine().getPrice())
                            .setStockQuantity(item.getMedicine().getStockQuantity())
                            .setCreatedAt(item.getMedicine().getCreatedAt() != null ? item.getMedicine().getCreatedAt().toString() : "")
                            .setUpdatedAt(item.getMedicine().getUpdatedAt() != null ? item.getMedicine().getUpdatedAt().toString() : "")
                            .build()
                    )
                    .setQuantity(item.getQuantity())
                    .setDosageInstruction(item.getDosageInstruction())
                    .setTotalCost(item.getTotalCost())
                    .build()
            );
        }
        
        responseObserver.onNext(prescriptionBuilder.build());
        responseObserver.onCompleted();
    }

    @Override
    public void updatePrescription(uni.hcmus.medicineservice.grpc.UpdatePrescriptionRequest request, StreamObserver<uni.hcmus.medicineservice.grpc.PrescriptionResponse> responseObserver) {
        // Convert proto items to DTO items
        var itemRequests = request.getItemsList().stream()
            .map(item -> new UpdatePrescriptionItemRequest(
                item.getPrescriptionItemId(),
                item.getMedicineId(),
                item.getQuantity(),
                item.getDosageInstruction()
            ))
            .collect(Collectors.toList());
        
        UpdatePrescriptionRequest updateRequest = new UpdatePrescriptionRequest(
            request.getMedicalRecordId(),
            itemRequests
        );
        
        PrescriptionResponse p = prescriptionService.updatePrescription(request.getPrescriptionId(), updateRequest);
        
        var prescriptionBuilder = uni.hcmus.medicineservice.grpc.PrescriptionResponse.newBuilder()
            .setPrescriptionId(p.getPrescriptionId())
            .setMedicalRecordId(p.getMedicalRecordId())
            .setTotalCost(p.getTotalCost())
            .setStatus(p.getStatus() != null ? p.getStatus().name() : "")
            .setIsPaid(p.getIsPaid())
            .setCreatedAt(p.getCreatedAt() != null ? p.getCreatedAt().toString() : "")
            .setUpdatedAt(p.getUpdatedAt() != null ? p.getUpdatedAt().toString() : "");
        
        // Add prescription items
        for (PrescriptionItemResponse item : p.getItems()) {
            prescriptionBuilder.addItems(
                uni.hcmus.medicineservice.grpc.PrescriptionItemResponse.newBuilder()
                    .setPrescriptionItemId(item.getPrescriptionItemId())
                    .setMedicine(
                        uni.hcmus.medicineservice.grpc.MedicineResponse.newBuilder()
                            .setMedicineId(item.getMedicine().getMedicineId())
                            .setName(item.getMedicine().getName())
                            .setUnit(item.getMedicine().getUnit())
                            .setSupplier(item.getMedicine().getSupplier())
                            .setPrice(item.getMedicine().getPrice())
                            .setStockQuantity(item.getMedicine().getStockQuantity())
                            .setCreatedAt(item.getMedicine().getCreatedAt() != null ? item.getMedicine().getCreatedAt().toString() : "")
                            .setUpdatedAt(item.getMedicine().getUpdatedAt() != null ? item.getMedicine().getUpdatedAt().toString() : "")
                            .build()
                    )
                    .setQuantity(item.getQuantity())
                    .setDosageInstruction(item.getDosageInstruction())
                    .setTotalCost(item.getTotalCost())
                    .build()
            );
        }
        
        responseObserver.onNext(prescriptionBuilder.build());
        responseObserver.onCompleted();
    }

    @Override
    public void deletePrescription(PrescriptionIdRequest request, StreamObserver<Empty> responseObserver) {
        prescriptionService.deletePrescription(request.getPrescriptionId());
        responseObserver.onNext(Empty.newBuilder().build());
        responseObserver.onCompleted();
    }

    public void restorePrescription(PrescriptionIdRequest request, StreamObserver<Empty> responseObserver) {
        prescriptionService.restorePrescription(request.getPrescriptionId());
        responseObserver.onNext(Empty.newBuilder().build());
        responseObserver.onCompleted();
    }
}