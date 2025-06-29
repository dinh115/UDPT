package uni.hcmus.medicineservice.prescription.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import uni.hcmus.medicineservice.prescription.model.dto.*;
import uni.hcmus.medicineservice.prescription.model.enums.PrescriptionStatus;

import java.util.List;

public interface PrescriptionService {
    
    Page<PrescriptionResponse> searchPrescriptions(String keyword, PrescriptionStatus status, Boolean isPaid, Pageable pageable);
    
    PrescriptionResponse getPrescriptionById(String prescriptionId);
    
    PrescriptionResponse createPrescription(CreatePrescriptionRequest request);
    
    PrescriptionResponse updatePrescription(String prescriptionId, UpdatePrescriptionRequest request);
    
    PrescriptionResponse updatePrescriptionStatus(String prescriptionId, UpdatePrescriptionStatusRequest request);
    
    PrescriptionResponse updatePrescriptionPayment(String prescriptionId, UpdatePrescriptionPaymentRequest request);
    
    void deletePrescription(String prescriptionId);
    
    void restorePrescription(String prescriptionId);
    
    List<PrescriptionResponse> getAllPrescriptions();
    
    List<PrescriptionResponse> getPrescriptionsByStatus(PrescriptionStatus status);
    
    List<PrescriptionResponse> getPrescriptionsByPaymentStatus(Boolean isPaid);
}