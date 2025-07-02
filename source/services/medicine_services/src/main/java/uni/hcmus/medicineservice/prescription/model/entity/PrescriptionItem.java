package uni.hcmus.medicineservice.prescription.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import uni.hcmus.medicineservice.common.model.entity.BaseEntity;
import uni.hcmus.medicineservice.medicine.model.entity.Medicine;

@Entity
@Table(name = "prescription_item")
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class PrescriptionItem extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "prescription_item_id")
    private String prescriptionItemId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prescription_id", nullable = false)
    private Prescription prescription;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "medicine_id", nullable = false)
    private Medicine medicine;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "total_cost", nullable = false)
    private Double totalCost;
    
    @Column(name = "dosage_instruction")
    private String dosageInstruction;
    
    public void calculateTotalCost() {
        if (medicine != null && quantity != null) {
            this.totalCost = medicine.getPrice() * quantity;
        } else {
            this.totalCost = 0.0;
        }
    }
}