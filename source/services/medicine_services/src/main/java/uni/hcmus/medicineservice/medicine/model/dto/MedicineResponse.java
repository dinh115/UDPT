package uni.hcmus.medicineservice.medicine.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Medicine information")
public class MedicineResponse {

    @Schema(description = "Medicine ID", example = "550e8400-e29b-41d4-a716-446655440000")
    private String medicineId;

    @Schema(description = "Medicine name", example = "Paracetamol")
    private String name;

    @Schema(description = "Unit", example = "Tablet")
    private String unit;

    @Schema(description = "Supplier", example = "XYZ Pharmaceuticals")
    private String supplier;

    @Schema(description = "Price", example = "15000")
    private Double price;

    @Schema(description = "Stock quantity", example = "100")
    private Integer stockQuantity;
    
    @Schema(description = "Created time")
    private LocalDateTime createdAt;
    
    @Schema(description = "Last updated time")
    private LocalDateTime updatedAt;

    @Schema(description = "Indicates if the medicine is deleted", example = "false")
    private Boolean isDeleted;
}