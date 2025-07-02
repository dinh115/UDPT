package uni.hcmus.medicineservice.medicine.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import uni.hcmus.medicineservice.common.model.entity.BaseEntity;

@Entity
@Table(name = "medicine")
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class Medicine extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "medicine_id")
    private String medicineId;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "unit", nullable = false)
    private String unit;

    @Column(name = "supplier", nullable = false)
    private String supplier;

    @Column(name = "price", nullable = false)
    private double price;

    @Column(name = "stock_quantity", nullable = false)
    private int stockQuantity;
}