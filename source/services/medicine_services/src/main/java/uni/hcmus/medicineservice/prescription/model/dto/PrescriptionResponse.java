package uni.hcmus.medicineservice.prescription.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uni.hcmus.medicineservice.prescription.model.enums.PrescriptionStatus;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Prescription information")
public class PrescriptionResponse {
    
    @Schema(description = "Prescription ID", example = "550e8400-e29b-41d4-a716-446655440000")
    private String prescriptionId;
    
    @Schema(description = "Medical record ID", example = "MR12345")
    private String medicalRecordId;
    
    @Schema(description = "Total cost of the prescription", example = "125000")
    private Double totalCost;
    
    @Schema(description = "Current status of the prescription")
    private PrescriptionStatus status;
    
    @Schema(description = "Payment status", example = "true")
    private Boolean isPaid;
    
    @Schema(description = "Items in the prescription")
    private List<PrescriptionItemResponse> items;
    
    @Schema(description = "Created time")
    private LocalDateTime createdAt;
    
    @Schema(description = "Last updated time")
    private LocalDateTime updatedAt;

    @Schema(description = "Is the prescription deleted?")
    private boolean isDeleted;
}