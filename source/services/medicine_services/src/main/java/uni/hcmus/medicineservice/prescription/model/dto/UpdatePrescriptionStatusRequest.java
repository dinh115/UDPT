package uni.hcmus.medicineservice.prescription.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uni.hcmus.medicineservice.prescription.model.enums.PrescriptionStatus;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request to update a prescription status")
public class UpdatePrescriptionStatusRequest {
    
    @NotNull(message = "Status cannot be null")
    @Schema(description = "New status for the prescription", requiredMode = Schema.RequiredMode.REQUIRED)
    private PrescriptionStatus status;
}