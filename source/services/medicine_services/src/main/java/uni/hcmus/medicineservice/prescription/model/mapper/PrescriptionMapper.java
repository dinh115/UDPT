package uni.hcmus.medicineservice.prescription.model.mapper;

import org.mapstruct.*;
import uni.hcmus.medicineservice.medicine.model.entity.Medicine;
import uni.hcmus.medicineservice.medicine.model.mapper.MedicineMapper;
import uni.hcmus.medicineservice.prescription.model.dto.*;
import uni.hcmus.medicineservice.prescription.model.entity.Prescription;
import uni.hcmus.medicineservice.prescription.model.entity.PrescriptionItem;

import java.util.List;

@Mapper(componentModel = "spring", uses = {MedicineMapper.class})
public interface PrescriptionMapper {
    
    @Mapping(target = "prescriptionId", ignore = true)
    @Mapping(target = "status", constant = "CREATED")
    @Mapping(target = "isPaid", constant = "false")
    @Mapping(target = "totalCost", ignore = true)
    @Mapping(target = "items", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "isDeleted", ignore = true)
    Prescription toEntity(CreatePrescriptionRequest request);
    
    @Mapping(target = "prescriptionItemId", ignore = true)
    @Mapping(target = "prescription", ignore = true)
    @Mapping(target = "totalCost", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "isDeleted", ignore = true)
    PrescriptionItem toEntity(CreatePrescriptionItemRequest request, Medicine medicine);
    
    @Mapping(target = "prescriptionId", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "isPaid", ignore = true)
    @Mapping(target = "totalCost", ignore = true)
    @Mapping(target = "items", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "isDeleted", ignore = true)
    void updateEntity(UpdatePrescriptionRequest request, @MappingTarget Prescription prescription);
    
    PrescriptionResponse toResponse(Prescription prescription);
    
    List<PrescriptionResponse> toResponseList(List<Prescription> prescriptions);
    
    @Mapping(target = "medicine", source = "medicine")
    PrescriptionItemResponse toItemResponse(PrescriptionItem prescriptionItem);
    
    List<PrescriptionItemResponse> toItemResponseList(List<PrescriptionItem> items);
}