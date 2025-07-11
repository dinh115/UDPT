package uni.hcmus.medicineservice.prescription.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uni.hcmus.medicineservice.prescription.model.enums.PrescriptionStatus;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request to update a prescription")
public class UpdatePrescriptionRequest {
    @Schema(description = "Prescription ID", example = "PR12345")
    private String prescriptionId;
    
    @Schema(description = "Medical record ID", example = "MR12345")
    private String medicalRecordId;
    
    @NotNull(message = "Payment status cannot be null")
    @Schema(description = "Payment status of prescription", example = "true", requiredMode = Schema.RequiredMode.REQUIRED)
    private Boolean isPaid;

    @NotNull(message = "Status cannot be null")
    @Schema(description = "New status for the prescription", requiredMode = Schema.RequiredMode.REQUIRED)
    private PrescriptionStatus status;

    @NotEmpty(message = "Prescription must have at least one item")
    @Valid
    @Schema(description = "List of prescription items", requiredMode = Schema.RequiredMode.REQUIRED)
    private List<UpdatePrescriptionItemRequest> items;
}