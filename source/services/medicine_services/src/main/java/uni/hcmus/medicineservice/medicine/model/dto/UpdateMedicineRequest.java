package uni.hcmus.medicineservice.medicine.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request to update medicine information")
public class UpdateMedicineRequest {
    
    @NotBlank(message = "Medicine name cannot be blank")
    @Schema(description = "Name of the medicine", example = "Paracetamol", requiredMode = Schema.RequiredMode.REQUIRED)
    private String name;

    @NotBlank(message = "Unit cannot be blank")
    @Schema(description = "Unit of the medicine", example = "Tablet", requiredMode = Schema.RequiredMode.REQUIRED)
    private String unit;

    @NotBlank(message = "Supplier cannot be blank")
    @Schema(description = "Name of supplier", example = "XYZ Pharmaceuticals", requiredMode = Schema.RequiredMode.REQUIRED)
    private String supplier;

    @NotNull(message = "Price cannot be blank")
    @Positive(message = "Price must be greater than 0")
    @Schema(description = "Price of the medicine", example = "15000", requiredMode = Schema.RequiredMode.REQUIRED)
    private Double price;

    @NotNull(message = "Stock quantity cannot be blank")
    @Min(value = 0, message = "Stock quantity cannot be negative")
    @Schema(description = "Stock quantity", example = "100", requiredMode = Schema.RequiredMode.REQUIRED)
    private Integer stockQuantity;
}