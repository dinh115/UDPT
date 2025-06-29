package uni.hcmus.medicineservice.resource;

import io.grpc.stub.StreamObserver;
import lombok.RequiredArgsConstructor;
import net.devh.boot.grpc.server.service.GrpcService;
import uni.hcmus.medicineservice.medicine.service.MedicineService;
import uni.hcmus.medicineservice.medicine.model.dto.CreateMedicineRequest;
import uni.hcmus.medicineservice.medicine.model.dto.UpdateMedicineRequest;
import uni.hcmus.medicineservice.medicine.model.dto.MedicineResponse;
import uni.hcmus.medicineservice.grpc.MedicineServiceGrpc;
import uni.hcmus.medicineservice.grpc.Empty;
import uni.hcmus.medicineservice.grpc.MedicineListResponse;
import uni.hcmus.medicineservice.grpc.MedicineIdRequest;

@GrpcService
@RequiredArgsConstructor
public class MedicineResource extends MedicineServiceGrpc.MedicineServiceImplBase {

    private final MedicineService medicineService;

    @Override
    public void getAllMedicines(Empty request, StreamObserver<MedicineListResponse> responseObserver) {
        var medicines = medicineService.getAllMedicines();
        var responseBuilder = MedicineListResponse.newBuilder();
        for (MedicineResponse m : medicines) {
            responseBuilder.addMedicines(
                uni.hcmus.medicineservice.grpc.MedicineResponse.newBuilder()
                    .setMedicineId(m.getMedicineId())
                    .setName(m.getName())
                    .setUnit(m.getUnit())
                    .setSupplier(m.getSupplier())
                    .setPrice(m.getPrice())
                    .setStockQuantity(m.getStockQuantity())
                    .setCreatedAt(m.getCreatedAt() != null ? m.getCreatedAt().toString() : "")
                    .setUpdatedAt(m.getUpdatedAt() != null ? m.getUpdatedAt().toString() : "")
                    .build()
            );
        }
        responseObserver.onNext(responseBuilder.build());
        responseObserver.onCompleted();
    }

    @Override
    public void getMedicineById(MedicineIdRequest request, StreamObserver<uni.hcmus.medicineservice.grpc.MedicineResponse> responseObserver) {
        MedicineResponse m = medicineService.getMedicineById(request.getMedicineId());
        uni.hcmus.medicineservice.grpc.MedicineResponse response = uni.hcmus.medicineservice.grpc.MedicineResponse.newBuilder()
            .setMedicineId(m.getMedicineId())
            .setName(m.getName())
            .setUnit(m.getUnit())
            .setSupplier(m.getSupplier())
            .setPrice(m.getPrice())
            .setStockQuantity(m.getStockQuantity())
            .setCreatedAt(m.getCreatedAt() != null ? m.getCreatedAt().toString() : "")
            .setUpdatedAt(m.getUpdatedAt() != null ? m.getUpdatedAt().toString() : "")
            .build();
        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }

    @Override
    public void createMedicine(uni.hcmus.medicineservice.grpc.CreateMedicineRequest request, StreamObserver<uni.hcmus.medicineservice.grpc.MedicineResponse> responseObserver) {
        CreateMedicineRequest createRequest = new CreateMedicineRequest(
            request.getName(),
            request.getUnit(),
            request.getSupplier(),
            request.getPrice(),
            request.getStockQuantity()
        );
        MedicineResponse m = medicineService.createMedicine(createRequest);
        uni.hcmus.medicineservice.grpc.MedicineResponse response = uni.hcmus.medicineservice.grpc.MedicineResponse.newBuilder()
            .setMedicineId(m.getMedicineId())
            .setName(m.getName())
            .setUnit(m.getUnit())
            .setSupplier(m.getSupplier())
            .setPrice(m.getPrice())
            .setStockQuantity(m.getStockQuantity())
            .setCreatedAt(m.getCreatedAt() != null ? m.getCreatedAt().toString() : "")
            .setUpdatedAt(m.getUpdatedAt() != null ? m.getUpdatedAt().toString() : "")
            .build();
        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }

    @Override
    public void updateMedicine(uni.hcmus.medicineservice.grpc.UpdateMedicineRequest request, StreamObserver<uni.hcmus.medicineservice.grpc.MedicineResponse> responseObserver) {
        UpdateMedicineRequest updateRequest = new UpdateMedicineRequest(
            request.getName(),
            request.getUnit(),
            request.getSupplier(),
            request.getPrice(),
            request.getStockQuantity()
        );
        MedicineResponse m = medicineService.updateMedicine(request.getMedicineId(), updateRequest);
        uni.hcmus.medicineservice.grpc.MedicineResponse response = uni.hcmus.medicineservice.grpc.MedicineResponse.newBuilder()
            .setMedicineId(m.getMedicineId())
            .setName(m.getName())
            .setUnit(m.getUnit())
            .setSupplier(m.getSupplier())
            .setPrice(m.getPrice())
            .setStockQuantity(m.getStockQuantity())
            .setCreatedAt(m.getCreatedAt() != null ? m.getCreatedAt().toString() : "")
            .setUpdatedAt(m.getUpdatedAt() != null ? m.getUpdatedAt().toString() : "")
            .build();
        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }

    @Override
    public void deleteMedicine(MedicineIdRequest request, StreamObserver<Empty> responseObserver) {
        medicineService.deleteMedicine(request.getMedicineId());
        responseObserver.onNext(Empty.newBuilder().build());
        responseObserver.onCompleted();
    }

    @Override
    public void restoreMedicine(MedicineIdRequest request, StreamObserver<Empty> responseObserver) {
        medicineService.restoreMedicine(request.getMedicineId());
        responseObserver.onNext(Empty.newBuilder().build());
        responseObserver.onCompleted();
    }
}