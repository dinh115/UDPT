package uni.hcmus.medicineservice.prescription.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import uni.hcmus.medicineservice.common.model.entity.BaseEntity;
import uni.hcmus.medicineservice.prescription.model.enums.PrescriptionStatus;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "prescription")
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class Prescription extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "prescription_id")
    private String prescriptionId;

    @Column(name = "medical_record_id")
    private String medicalRecordId;
    
    @Column(name = "total_cost", nullable = false)
    private Double totalCost;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private PrescriptionStatus status;
    
    @Column(name = "is_paid", nullable = false)
    private Boolean isPaid = false;

    @OneToMany(mappedBy = "prescription", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PrescriptionItem> items = new ArrayList<>();
    
    public void calculateTotalCost() {
        this.totalCost = this.items.stream()
                .filter(item -> !item.getIsDeleted())
                .mapToDouble(PrescriptionItem::getTotalCost)
                .sum();
    }
}