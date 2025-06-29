package uni.hcmus.medicineservice.medicine.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import uni.hcmus.medicineservice.medicine.model.entity.Medicine;

import java.util.Optional;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine, String> {
    
    boolean existsByNameAndIsDeletedFalse(String name);
    
    @Query("SELECT m FROM Medicine m WHERE " +
            "m.isDeleted = false AND " +
            "(:keyword IS NULL OR " +
            "LOWER(m.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(m.supplier) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "AND (:unit IS NULL OR m.unit = :unit) " +
            "AND (:minPrice IS NULL OR m.price >= :minPrice) " +
            "AND (:maxPrice IS NULL OR m.price <= :maxPrice)")
    Page<Medicine> searchMedicines(String keyword, String unit, Double minPrice, Double maxPrice, Pageable pageable);
    
    // Find medicine that is not deleted
    Optional<Medicine> findByMedicineIdAndIsDeletedFalse(String medicineId);
    
    // Check if medicine exists and is not deleted
    boolean existsByMedicineIdAndIsDeletedFalse(String medicineId);
    
    // Soft delete instead of hard delete
    @Modifying
    @Query("UPDATE Medicine m SET m.isDeleted = true WHERE m.medicineId = :medicineId")
    void softDelete(String medicineId);

    // Restore soft-deleted medicine
    @Modifying
    @Query("UPDATE Medicine m SET m.isDeleted = false WHERE m.medicineId = :medicineId")
    void restoreMedicine(String medicineId);
}