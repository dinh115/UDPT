package uni.hcmus.medicineservice.medicine.model.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import uni.hcmus.medicineservice.medicine.model.dto.CreateMedicineRequest;
import uni.hcmus.medicineservice.medicine.model.dto.MedicineResponse;
import uni.hcmus.medicineservice.medicine.model.dto.UpdateMedicineRequest;
import uni.hcmus.medicineservice.medicine.model.entity.Medicine;

@Mapper(componentModel = "spring")
public interface MedicineMapper {
    
    MedicineResponse toResponse(Medicine medicine);
    
    @Mapping(target = "medicineId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "isDeleted", ignore = true)
    Medicine toEntity(CreateMedicineRequest request);
    
    @Mapping(target = "medicineId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "isDeleted", ignore = true)
    void updateEntity(UpdateMedicineRequest request, @MappingTarget Medicine medicine);
}