package uni.hcmus.medicineservice.medicine.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import uni.hcmus.medicineservice.medicine.exception.MedicineAlreadyExistsException;
import uni.hcmus.medicineservice.medicine.exception.MedicineNotFoundException;
import uni.hcmus.medicineservice.medicine.model.dto.CreateMedicineRequest;
import uni.hcmus.medicineservice.medicine.model.dto.MedicineResponse;
import uni.hcmus.medicineservice.medicine.model.dto.UpdateMedicineRequest;
import uni.hcmus.medicineservice.medicine.model.entity.Medicine;
import uni.hcmus.medicineservice.medicine.model.mapper.MedicineMapper;
import uni.hcmus.medicineservice.medicine.repository.MedicineRepository;
import uni.hcmus.medicineservice.medicine.service.MedicineService;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class MedicineServiceImpl implements MedicineService {

    private final MedicineRepository medicineRepository;
    private final MedicineMapper medicineMapper;

    @Override
    @Transactional(readOnly = true)
    public List<MedicineResponse> getAllMedicines() {
        log.info("MedicineServiceImpl | getAllMedicines | Getting all medicines");
        try {
            List<Medicine> medicineList = medicineRepository.findAll()
                                    .stream()
                                    .filter(medicine -> !medicine.getIsDeleted())
                                    .collect(Collectors.toList());
            return medicineList.stream()
                    .map(medicineMapper::toResponse)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("MedicineServiceImpl | getAllMedicines | Error: {}", e.getMessage(), e);
            throw e;
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Page<MedicineResponse> searchMedicines(String keyword, String unit, Double minPrice, Double maxPrice, Pageable pageable) {
        log.info("MedicineServiceImpl | searchMedicines | Searching with keyword: {}, unit: {}, price range: {} - {}", 
                keyword, unit, minPrice, maxPrice);
        try {
            Page<Medicine> medicinePage = medicineRepository.searchMedicines(keyword, unit, minPrice, maxPrice, pageable);
            return medicinePage.map(medicineMapper::toResponse);
        } catch (Exception e) {
            log.error("MedicineServiceImpl | searchMedicines | Error: {}", e.getMessage(), e);
            throw e;
        }
    }

    @Override
    @Transactional(readOnly = true)
    public MedicineResponse getMedicineById(String medicineId) {
        log.info("MedicineServiceImpl | getMedicineById | Getting medicine with ID: {}", medicineId);
        try {
            Medicine medicine = findMedicineById(medicineId);
            return medicineMapper.toResponse(medicine);
        } catch (MedicineNotFoundException e) {
            throw e;
        } catch (Exception e) {
            log.error("MedicineServiceImpl | getMedicineById | Error: {}", e.getMessage(), e);
            throw e;
        }
    }

    @Override
    @Transactional
    public MedicineResponse createMedicine(CreateMedicineRequest request) {
        log.info("MedicineServiceImpl | createMedicine | Creating new medicine with name: {}", request.getName());
        try {
            // Check if medicine already exists and is not deleted
            if (medicineRepository.existsByNameAndIsDeletedFalse(request.getName())) {
                log.error("MedicineServiceImpl | createMedicine | Medicine already exists with name: {}", request.getName());
                throw new MedicineAlreadyExistsException(request.getName());
            }
            
            // Map from request to entity and save
            Medicine medicine = medicineMapper.toEntity(request);
            Medicine savedMedicine = medicineRepository.save(medicine);
            
            log.info("MedicineServiceImpl | createMedicine | Created medicine with ID: {}", savedMedicine.getMedicineId());
            return medicineMapper.toResponse(savedMedicine);
        } catch (MedicineAlreadyExistsException e) {
            throw e;
        } catch (DataAccessException e) {
            log.error("MedicineServiceImpl | createMedicine | Database error: {}", e.getMessage(), e);
            throw e;
        } catch (Exception e) {
            log.error("MedicineServiceImpl | createMedicine | Error: {}", e.getMessage(), e);
            throw e;
        }
    }

    @Override
    @Transactional
    public MedicineResponse updateMedicine(String medicineId, UpdateMedicineRequest request) {
        log.info("MedicineServiceImpl | updateMedicine | Updating medicine with ID: {}", medicineId);
        try {
            // Find medicine that isn't deleted
            Medicine medicine = findMedicineById(medicineId);
            
            // Check if name changed and new name already exists
            if (!medicine.getName().equals(request.getName()) && 
                    medicineRepository.existsByNameAndIsDeletedFalse(request.getName())) {
                log.error("MedicineServiceImpl | updateMedicine | Medicine already exists with name: {}", request.getName());
                throw new MedicineAlreadyExistsException(request.getName());
            }
            
            // Map info from request to entity and save
            medicineMapper.updateEntity(request, medicine);
            Medicine updatedMedicine = medicineRepository.save(medicine);
            
            log.info("MedicineServiceImpl | updateMedicine | Updated medicine with ID: {}", updatedMedicine.getMedicineId());
            return medicineMapper.toResponse(updatedMedicine);
        } catch (MedicineNotFoundException | MedicineAlreadyExistsException e) {
            throw e;
        } catch (DataAccessException e) {
            log.error("MedicineServiceImpl | updateMedicine | Database error: {}", e.getMessage(), e);
            throw e;
        } catch (Exception e) {
            log.error("MedicineServiceImpl | updateMedicine | Error: {}", e.getMessage(), e);
            throw e;
        }
    }

    @Override
    @Transactional
    public void deleteMedicine(String medicineId) {
        log.info("MedicineServiceImpl | deleteMedicine | Soft deleting medicine with ID: {}", medicineId);
        try {
            // Check if medicine exists and is not deleted
            if (!medicineRepository.existsByMedicineIdAndIsDeletedFalse(medicineId)) {
                log.error("MedicineServiceImpl | deleteMedicine | Medicine not found with ID: {}", medicineId);
                throw new MedicineNotFoundException(medicineId);
            }
            
            // Soft delete the medicine
            medicineRepository.softDelete(medicineId);
            log.info("MedicineServiceImpl | deleteMedicine | Soft deleted medicine with ID: {}", medicineId);
        } catch (MedicineNotFoundException e) {
            throw e;
        } catch (DataAccessException e) {
            log.error("MedicineServiceImpl | deleteMedicine | Database error: {}", e.getMessage(), e);
            throw e;
        } catch (Exception e) {
            log.error("MedicineServiceImpl | deleteMedicine | Error: {}", e.getMessage(), e);
            throw e;
        }
    }

    @Override
    @Transactional
    public void restoreMedicine(String medicineId) {
        log.info("MedicineServiceImpl | restoreMedicine | Restoring medicine with ID: {}", medicineId);
        try {
            // Check if medicine exists
            if (!medicineRepository.existsById(medicineId)) {
                log.error("MedicineServiceImpl | restoreMedicine | Medicine not found with ID: {}", medicineId);
                throw new MedicineNotFoundException(medicineId);
            }
            
            // Restore soft-deleted medicine
            medicineRepository.restoreMedicine(medicineId);
            log.info("MedicineServiceImpl | restoreMedicine | Restored medicine with ID: {}", medicineId);
        } catch (MedicineNotFoundException e) {
            throw e;
        } catch (Exception e) {
            log.error("MedicineServiceImpl | restoreMedicine | Error: {}", e.getMessage(), e);
            throw e;
        }
    }
    
    // Helper method to find medicine by ID
    private Medicine findMedicineById(String medicineId) {
        return medicineRepository.findByMedicineIdAndIsDeletedFalse(medicineId)
                .orElseThrow(() -> {
                    log.error("MedicineServiceImpl | findMedicineById | Medicine not found with ID: {}", medicineId);
                    return new MedicineNotFoundException(medicineId);
                });
    }
}