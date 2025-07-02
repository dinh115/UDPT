package uni.hcmus.medicineservice.medicine.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import uni.hcmus.medicineservice.medicine.model.dto.CreateMedicineRequest;
import uni.hcmus.medicineservice.medicine.model.dto.MedicineResponse;
import uni.hcmus.medicineservice.medicine.model.dto.UpdateMedicineRequest;

import java.util.List;

public interface MedicineService {
    
    Page<MedicineResponse> searchMedicines(String keyword, String unit, Double minPrice, Double maxPrice, Pageable pageable);
    
    MedicineResponse getMedicineById(String medicineId);
    
    MedicineResponse createMedicine(CreateMedicineRequest request);
    
    MedicineResponse updateMedicine(String medicineId, UpdateMedicineRequest request);
    
    void deleteMedicine(String medicineId);
    
    List<MedicineResponse> getAllMedicines();

    void restoreMedicine(String medicineId);
}