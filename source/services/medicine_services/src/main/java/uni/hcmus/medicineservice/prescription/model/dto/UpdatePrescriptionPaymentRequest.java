package uni.hcmus.medicineservice.prescription.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request to update prescription payment status")
public class UpdatePrescriptionPaymentRequest {
    
    @NotNull(message = "Payment status cannot be null")
    @Schema(description = "Payment status of prescription", example = "true", requiredMode = Schema.RequiredMode.REQUIRED)
    private Boolean isPaid;
}