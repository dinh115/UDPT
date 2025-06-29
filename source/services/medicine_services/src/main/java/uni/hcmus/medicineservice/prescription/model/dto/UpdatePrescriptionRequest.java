package uni.hcmus.medicineservice.prescription.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request to update a prescription")
public class UpdatePrescriptionRequest {
    
    @Schema(description = "Medical record ID", example = "MR12345")
    private String medicalRecordId;
    
    @NotEmpty(message = "Prescription must have at least one item")
    @Valid
    @Schema(description = "List of prescription items", requiredMode = Schema.RequiredMode.REQUIRED)
    private List<UpdatePrescriptionItemRequest> items;
}