package uni.hcmus.medicineservice.prescription.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import uni.hcmus.medicineservice.prescription.model.entity.Prescription;
import uni.hcmus.medicineservice.prescription.model.enums.PrescriptionStatus;

import java.util.List;
import java.util.Optional;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, String> {
    
    Optional<Prescription> findByPrescriptionIdAndIsDeletedFalse(String prescriptionId);
    
    boolean existsByPrescriptionIdAndIsDeletedFalse(String prescriptionId);
    
    @Modifying
    @Query("UPDATE Prescription p SET p.isDeleted = true WHERE p.prescriptionId = :prescriptionId")
    void softDelete(String prescriptionId);
    
    @Modifying
    @Query("UPDATE Prescription p SET p.isDeleted = false WHERE p.prescriptionId = :prescriptionId")
    void restorePrescription(String prescriptionId);
    
    @Query("SELECT p FROM Prescription p WHERE " +
           "p.isDeleted = false AND " +
           "(:keyword IS NULL OR " +
           "LOWER(p.medicalRecordId) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "AND (:status IS NULL OR p.status = :status) " +
           "AND (:isPaid IS NULL OR p.isPaid = :isPaid)")
    Page<Prescription> searchPrescriptions(String keyword, PrescriptionStatus status, Boolean isPaid, Pageable pageable);
    
    List<Prescription> findByStatusAndIsDeletedFalse(PrescriptionStatus status);
    
    List<Prescription> findByIsPaidAndIsDeletedFalse(Boolean isPaid);
}