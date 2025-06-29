package uni.hcmus.medicineservice.prescription.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request to create a prescription item")
public class CreatePrescriptionItemRequest {
    
    @NotBlank(message = "Medicine ID cannot be blank")
    @Schema(description = "ID of the medicine", example = "med-123", requiredMode = Schema.RequiredMode.REQUIRED)
    private String medicineId;
    
    @NotNull(message = "Quantity cannot be null")
    @Min(value = 1, message = "Quantity must be at least 1")
    @Schema(description = "Quantity of the medicine", example = "3", requiredMode = Schema.RequiredMode.REQUIRED)
    private Integer quantity;
    
    @Schema(description = "Dosage instructions", example = "Take one pill three times daily")
    private String dosageInstruction;
}