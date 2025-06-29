package uni.hcmus.medicineservice.prescription.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uni.hcmus.medicineservice.medicine.model.dto.MedicineResponse;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Prescription item information")
public class PrescriptionItemResponse {
    
    @Schema(description = "Prescription item ID", example = "550e8400-e29b-41d4-a716-446655440001")
    private String prescriptionItemId;
    
    @Schema(description = "Medicine information")
    private MedicineResponse medicine;
    
    @Schema(description = "Quantity", example = "3")
    private Integer quantity;
    
    @Schema(description = "Dosage instructions", example = "Take one pill three times daily")
    private String dosageInstruction;
    
    @Schema(description = "Total cost for this item", example = "45000")
    private Double totalCost;
}