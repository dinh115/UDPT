package uni.hcmus.medicineservice.prescription.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import uni.hcmus.medicineservice.medicine.exception.MedicineNotFoundException;
import uni.hcmus.medicineservice.medicine.model.entity.Medicine;
import uni.hcmus.medicineservice.medicine.repository.MedicineRepository;
import uni.hcmus.medicineservice.prescription.exception.InvalidStatusTransitionException;
import uni.hcmus.medicineservice.prescription.exception.PrescriptionNotFoundException;
import uni.hcmus.medicineservice.prescription.model.dto.*;
import uni.hcmus.medicineservice.prescription.model.entity.Prescription;
import uni.hcmus.medicineservice.prescription.model.entity.PrescriptionItem;
import uni.hcmus.medicineservice.prescription.model.enums.PrescriptionStatus;
import uni.hcmus.medicineservice.prescription.model.mapper.PrescriptionMapper;
import uni.hcmus.medicineservice.prescription.repository.PrescriptionRepository;
import uni.hcmus.medicineservice.prescription.service.PrescriptionService;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PrescriptionServiceImpl implements PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final MedicineRepository medicineRepository;
    private final PrescriptionMapper prescriptionMapper;

    @Override
    @Transactional(readOnly = true)
    public Page<PrescriptionResponse> searchPrescriptions(String keyword, PrescriptionStatus status, Boolean isPaid, Pageable pageable) {
        log.info("PrescriptionServiceImpl | searchPrescriptions | Searching with keyword: {}, status: {}, isPaid: {}", 
                keyword, status, isPaid);
        try {
            Page<Prescription> prescriptionPage = prescriptionRepository.searchPrescriptions(keyword, status, isPaid, pageable);
            return prescriptionPage.map(prescriptionMapper::toResponse);
        } catch (Exception e) {
            log.error("PrescriptionServiceImpl | searchPrescriptions | Error: {}", e.getMessage(), e);
            throw e;
        }
    }

    @Override
    @Transactional(readOnly = true)
    public PrescriptionResponse getPrescriptionById(String prescriptionId) {
        log.info("PrescriptionServiceImpl | getPrescriptionById | Getting prescription with ID: {}", prescriptionId);
        try {
            Prescription prescription = findPrescriptionById(prescriptionId);
            return prescriptionMapper.toResponse(prescription);
        } catch (PrescriptionNotFoundException e) {
            throw e;
        } catch (Exception e) {
            log.error("PrescriptionServiceImpl | getPrescriptionById | Error: {}", e.getMessage(), e);
            throw e;
        }
    }

    @Override
    @Transactional
    public PrescriptionResponse createPrescription(CreatePrescriptionRequest request) {
        log.info("PrescriptionServiceImpl | createPrescription | Creating prescription with medical record ID: {}", 
                request.getMedicalRecordId());
        try {
            // Create prescription
            Prescription prescription = prescriptionMapper.toEntity(request);
            
            // Create prescription items
            List<PrescriptionItem> items = new ArrayList<>();
            for (CreatePrescriptionItemRequest itemRequest : request.getItems()) {
                Medicine medicine = medicineRepository.findByMedicineIdAndIsDeletedFalse(itemRequest.getMedicineId())
                        .orElseThrow(() -> new MedicineNotFoundException(itemRequest.getMedicineId()));
                
                PrescriptionItem item = prescriptionMapper.toEntity(itemRequest, medicine);
                item.setPrescription(prescription);
                item.calculateTotalCost();
                
                items.add(item);
            }
            prescription.setItems(items);
            
            // Calculate total cost
            prescription.calculateTotalCost();
            
            // Save prescription
            Prescription savedPrescription = prescriptionRepository.save(prescription);
            
            log.info("PrescriptionServiceImpl | createPrescription | Created prescription with ID: {}", 
                    savedPrescription.getPrescriptionId());
            return prescriptionMapper.toResponse(savedPrescription);
        } catch (MedicineNotFoundException e) {
            throw e;
        } catch (Exception e) {
            log.error("PrescriptionServiceImpl | createPrescription | Error: {}", e.getMessage(), e);
            throw e;
        }
    }

    @Override
    @Transactional
    public PrescriptionResponse updatePrescription(String prescriptionId, UpdatePrescriptionRequest request) {
        log.info("PrescriptionServiceImpl | updatePrescription | Updating prescription with ID: {}", prescriptionId);
        try {
            // Find prescription
            Prescription prescription = findPrescriptionById(prescriptionId);
            
            // Only allow updates if status is CREATED
            if (prescription.getStatus() != PrescriptionStatus.CREATED) {
                log.error("PrescriptionServiceImpl | updatePrescription | Cannot update prescription with status: {}", 
                        prescription.getStatus());
                throw new InvalidStatusTransitionException(prescription.getStatus(), prescription.getStatus());
            }
            
            // Update basic prescription details
            prescriptionMapper.updateEntity(request, prescription);
            
            // Track existing items to update or delete
            Map<String, PrescriptionItem> existingItemsMap = prescription.getItems().stream()
                    .filter(item -> !item.getIsDeleted())
                    .collect(Collectors.toMap(PrescriptionItem::getPrescriptionItemId, item -> item));
            
            Set<String> updatedItemIds = new HashSet<>();
            
            // Process items from the request
            for (UpdatePrescriptionItemRequest itemRequest : request.getItems()) {
                if (itemRequest.getPrescriptionItemId() != null && existingItemsMap.containsKey(itemRequest.getPrescriptionItemId())) {
                    // Update existing item
                    PrescriptionItem existingItem = existingItemsMap.get(itemRequest.getPrescriptionItemId());
                    
                    // Update medicine if changed
                    if (!existingItem.getMedicine().getMedicineId().equals(itemRequest.getMedicineId())) {
                        Medicine medicine = medicineRepository.findByMedicineIdAndIsDeletedFalse(itemRequest.getMedicineId())
                                .orElseThrow(() -> new MedicineNotFoundException(itemRequest.getMedicineId()));
                        existingItem.setMedicine(medicine);
                    }
                    
                    existingItem.setQuantity(itemRequest.getQuantity());
                    existingItem.setDosageInstruction(itemRequest.getDosageInstruction());
                    existingItem.calculateTotalCost();
                    
                    updatedItemIds.add(existingItem.getPrescriptionItemId());
                } else {
                    // Create new item
                    Medicine medicine = medicineRepository.findByMedicineIdAndIsDeletedFalse(itemRequest.getMedicineId())
                            .orElseThrow(() -> new MedicineNotFoundException(itemRequest.getMedicineId()));
                    
                    PrescriptionItem newItem = new PrescriptionItem();
                    newItem.setPrescription(prescription);
                    newItem.setMedicine(medicine);
                    newItem.setQuantity(itemRequest.getQuantity());
                    newItem.setDosageInstruction(itemRequest.getDosageInstruction());
                    newItem.calculateTotalCost();
                    
                    prescription.getItems().add(newItem);
                }
            }
            
            // Soft delete items not in the request
            for (PrescriptionItem item : prescription.getItems()) {
                if (!item.getIsDeleted() && item.getPrescriptionItemId() != null && 
                        !updatedItemIds.contains(item.getPrescriptionItemId())) {
                    item.setIsDeleted(true);
                }
            }
            
            // Recalculate total cost
            prescription.calculateTotalCost();
            
            // Save updated prescription
            Prescription updatedPrescription = prescriptionRepository.save(prescription);
            
            log.info("PrescriptionServiceImpl | updatePrescription | Updated prescription with ID: {}", prescriptionId);
            return prescriptionMapper.toResponse(updatedPrescription);
        } catch (PrescriptionNotFoundException | MedicineNotFoundException | InvalidStatusTransitionException e) {
            throw e;
        } catch (Exception e) {
            log.error("PrescriptionServiceImpl | updatePrescription | Error: {}", e.getMessage(), e);
            throw e;
        }
    }

    @Override
    @Transactional
    public PrescriptionResponse updatePrescriptionStatus(String prescriptionId, UpdatePrescriptionStatusRequest request) {
        log.info("PrescriptionServiceImpl | updatePrescriptionStatus | Updating status of prescription with ID: {} to {}", 
                prescriptionId, request.getStatus());
        try {
            Prescription prescription = findPrescriptionById(prescriptionId);
            PrescriptionStatus newStatus = request.getStatus();
            
            // Validate status transition
            validateStatusTransition(prescription.getStatus(), newStatus);
            
            prescription.setStatus(newStatus);
            Prescription updatedPrescription = prescriptionRepository.save(prescription);
            
            log.info("PrescriptionServiceImpl | updatePrescriptionStatus | Updated status to {} for prescription: {}", 
                    newStatus, prescriptionId);
            return prescriptionMapper.toResponse(updatedPrescription);
        } catch (PrescriptionNotFoundException | InvalidStatusTransitionException e) {
            throw e;
        } catch (Exception e) {
            log.error("PrescriptionServiceImpl | updatePrescriptionStatus | Error: {}", e.getMessage(), e);
            throw e;
        }
    }

    @Override
    @Transactional
    public PrescriptionResponse updatePrescriptionPayment(String prescriptionId, UpdatePrescriptionPaymentRequest request) {
        log.info("PrescriptionServiceImpl | updatePrescriptionPayment | Updating payment status of prescription with ID: {} to {}", 
                prescriptionId, request.getIsPaid());
        try {
            Prescription prescription = findPrescriptionById(prescriptionId);
            
            // Set payment status
            prescription.setIsPaid(request.getIsPaid());
            Prescription updatedPrescription = prescriptionRepository.save(prescription);
            
            log.info("PrescriptionServiceImpl | updatePrescriptionPayment | Updated payment status to {} for prescription: {}", 
                    request.getIsPaid(), prescriptionId);
            return prescriptionMapper.toResponse(updatedPrescription);
        } catch (PrescriptionNotFoundException e) {
            throw e;
        } catch (Exception e) {
            log.error("PrescriptionServiceImpl | updatePrescriptionPayment | Error: {}", e.getMessage(), e);
            throw e;
        }
    }

    @Override
    @Transactional
    public void deletePrescription(String prescriptionId) {
        log.info("PrescriptionServiceImpl | deletePrescription | Soft deleting prescription with ID: {}", prescriptionId);
        try {
            // Check if prescription exists and is not deleted
            if (!prescriptionRepository.existsByPrescriptionIdAndIsDeletedFalse(prescriptionId)) {
                log.error("PrescriptionServiceImpl | deletePrescription | Prescription not found with ID: {}", prescriptionId);
                throw new PrescriptionNotFoundException(prescriptionId);
            }
            
            prescriptionRepository.softDelete(prescriptionId);
            log.info("PrescriptionServiceImpl | deletePrescription | Soft deleted prescription with ID: {}", prescriptionId);
        } catch (PrescriptionNotFoundException e) {
            throw e;
        } catch (Exception e) {
            log.error("PrescriptionServiceImpl | deletePrescription | Error: {}", e.getMessage(), e);
            throw e;
        }
    }

    @Override
    @Transactional
    public void restorePrescription(String prescriptionId) {
        log.info("PrescriptionServiceImpl | restorePrescription | Restoring prescription with ID: {}", prescriptionId);
        try {
            // Check if prescription exists
            if (!prescriptionRepository.existsById(prescriptionId)) {
                log.error("PrescriptionServiceImpl | restorePrescription | Prescription not found with ID: {}", prescriptionId);
                throw new PrescriptionNotFoundException(prescriptionId);
            }
            
            prescriptionRepository.restorePrescription(prescriptionId);
            log.info("PrescriptionServiceImpl | restorePrescription | Restored prescription with ID: {}", prescriptionId);
        } catch (PrescriptionNotFoundException e) {
            throw e;
        } catch (Exception e) {
            log.error("PrescriptionServiceImpl | restorePrescription | Error: {}", e.getMessage(), e);
            throw e;
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<PrescriptionResponse> getAllPrescriptions() {
        log.info("PrescriptionServiceImpl | getAllPrescriptions | Getting all prescriptions");
        try {
            List<Prescription> prescriptions = prescriptionRepository.findAll().stream()
                    .collect(Collectors.toList());
            
            return prescriptionMapper.toResponseList(prescriptions);
        } catch (Exception e) {
            log.error("PrescriptionServiceImpl | getAllPrescriptions | Error: {}", e.getMessage(), e);
            throw e;
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<PrescriptionResponse> getPrescriptionsByStatus(PrescriptionStatus status) {
        log.info("PrescriptionServiceImpl | getPrescriptionsByStatus | Getting prescriptions with status: {}", status);
        try {
            List<Prescription> prescriptions = prescriptionRepository.findByStatusAndIsDeletedFalse(status);
            return prescriptionMapper.toResponseList(prescriptions);
        } catch (Exception e) {
            log.error("PrescriptionServiceImpl | getPrescriptionsByStatus | Error: {}", e.getMessage(), e);
            throw e;
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<PrescriptionResponse> getPrescriptionsByPaymentStatus(Boolean isPaid) {
        log.info("PrescriptionServiceImpl | getPrescriptionsByPaymentStatus | Getting prescriptions with payment status: {}", isPaid);
        try {
            List<Prescription> prescriptions = prescriptionRepository.findByIsPaidAndIsDeletedFalse(isPaid);
            return prescriptionMapper.toResponseList(prescriptions);
        } catch (Exception e) {
            log.error("PrescriptionServiceImpl | getPrescriptionsByPaymentStatus | Error: {}", e.getMessage(), e);
            throw e;
        }
    }
    
    // Helper methods
    private Prescription findPrescriptionById(String prescriptionId) {
        return prescriptionRepository.findByPrescriptionIdAndIsDeletedFalse(prescriptionId)
                .orElseThrow(() -> new PrescriptionNotFoundException(prescriptionId));
    }
    
    private void validateStatusTransition(PrescriptionStatus currentStatus, PrescriptionStatus newStatus) {
        // Define valid transitions
        Map<PrescriptionStatus, List<PrescriptionStatus>> validTransitions = Map.of(
                PrescriptionStatus.CREATED, List.of(PrescriptionStatus.READY),
                PrescriptionStatus.READY, List.of(PrescriptionStatus.PICKED_UP),
                PrescriptionStatus.PICKED_UP, List.of() // Terminal state
        );
        
        if (!validTransitions.containsKey(currentStatus) || 
                !validTransitions.get(currentStatus).contains(newStatus)) {
            throw new InvalidStatusTransitionException(currentStatus, newStatus);
        }
    }
}