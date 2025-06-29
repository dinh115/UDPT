// package uni.hcmus.medicineservice.medicine.controller;

// import io.swagger.v3.oas.annotations.Operation;
// import io.swagger.v3.oas.annotations.Parameter;
// import io.swagger.v3.oas.annotations.media.Content;
// import io.swagger.v3.oas.annotations.media.Schema;
// import io.swagger.v3.oas.annotations.responses.ApiResponse;
// import io.swagger.v3.oas.annotations.responses.ApiResponses;
// import io.swagger.v3.oas.annotations.tags.Tag;
// import jakarta.validation.Valid;
// import lombok.RequiredArgsConstructor;
// import lombok.extern.slf4j.Slf4j;

// import org.springframework.data.domain.Page;
// import org.springframework.data.domain.PageRequest;
// import org.springframework.data.domain.Pageable;
// import org.springframework.data.domain.Sort;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.MediaType;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;

// import uni.hcmus.medicineservice.common.model.dto.CustomResponse;
// import uni.hcmus.medicineservice.medicine.model.dto.CreateMedicineRequest;
// import uni.hcmus.medicineservice.medicine.model.dto.MedicineResponse;
// import uni.hcmus.medicineservice.medicine.model.dto.UpdateMedicineRequest;
// import uni.hcmus.medicineservice.medicine.service.MedicineService;

// import java.util.HashMap;
// import java.util.List;
// import java.util.Map;

// @RestController
// @RequestMapping("/medicines")
// @RequiredArgsConstructor
// @Slf4j
// @Tag(name = "Medicines", description = "Medicine management APIs")
// public class MedicineController {

//     private final MedicineService medicineService;

//     @Operation(summary = "Get all medicines", description = "Retrieve a list of all medicines in the system")
//     @ApiResponse(responseCode = "200", description = "Success")
//     @GetMapping("/all")
//     public ResponseEntity<CustomResponse<List<MedicineResponse>>> getAllMedicines() {
//         log.info("MedicineController | getAllMedicines | Retrieving all medicines");
//         List<MedicineResponse> result = medicineService.getAllMedicines();
//         return ResponseEntity.ok(
//                 CustomResponse.<List<MedicineResponse>>builder()
//                         .success(true)
//                         .message("Medicines retrieved successfully")
//                         .data(result)
//                         .build()
//         );
//     }

//     @Operation(summary = "Search medicines", description = "Search medicines with filters and pagination")
//     @ApiResponses({
//             @ApiResponse(responseCode = "200", description = "Success"),
//             @ApiResponse(responseCode = "400", description = "Invalid parameters", 
//                     content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, 
//                     schema = @Schema(implementation = CustomResponse.class)))
//     })
//     @GetMapping("/search")
//     public ResponseEntity<CustomResponse<Map<String, Object>>> searchMedicines(
//             @Parameter(description = "Search keyword (medicine name, supplier)") 
//             @RequestParam(required = false) String keyword,
            
//             @Parameter(description = "Medicine unit") 
//             @RequestParam(required = false) String unit,
            
//             @Parameter(description = "Minimum price") 
//             @RequestParam(required = false) Double minPrice,
            
//             @Parameter(description = "Maximum price") 
//             @RequestParam(required = false) Double maxPrice,
            
//             @Parameter(description = "Page number") 
//             @RequestParam(defaultValue = "0") int page,
            
//             @Parameter(description = "Items per page") 
//             @RequestParam(defaultValue = "10") int size,
            
//             @Parameter(description = "Sort field") 
//             @RequestParam(defaultValue = "name") String sortBy,
            
//             @Parameter(description = "Sort direction (ASC/DESC)") 
//             @RequestParam(defaultValue = "ASC") String sortDir) {
        
//         log.info("MedicineController | searchMedicines | Searching with keyword: {}, unit: {}, price range: {} - {}, page: {}, size: {}", 
//                 keyword, unit, minPrice, maxPrice, page, size);
        
//         Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
//         Pageable pageable = PageRequest.of(page, size, sort);
        
//         Page<MedicineResponse> medicinePage = medicineService.searchMedicines(keyword, unit, minPrice, maxPrice, pageable);

//         Map<String, Object> response = new HashMap<>();
//         response.put("medicines", medicinePage.getContent());
//         response.put("currentPage", medicinePage.getNumber());
//         response.put("totalItems", medicinePage.getTotalElements());
//         response.put("totalPages", medicinePage.getTotalPages());

//         return ResponseEntity.ok(
//                 CustomResponse.<Map<String, Object>>builder()
//                         .success(true)
//                         .message("Medicines searched successfully")
//                         .data(response)
//                         .build()
//         );
//     }

//     @Operation(summary = "Get medicine by ID", description = "Get detailed information of a medicine by its ID")
//     @ApiResponses({
//             @ApiResponse(responseCode = "200", description = "Success"),
//             @ApiResponse(responseCode = "404", description = "Medicine not found", 
//                     content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, 
//                     schema = @Schema(implementation = CustomResponse.class)))
//     })
//     @GetMapping("/{medicineId}")
//     public ResponseEntity<CustomResponse<MedicineResponse>> getMedicineById(
//             @Parameter(description = "Medicine ID", required = true) @PathVariable String medicineId) {
        
//         log.info("MedicineController | getMedicineById | Getting medicine with ID: {}", medicineId);
//         MedicineResponse medicine = medicineService.getMedicineById(medicineId);
        
//         return ResponseEntity.ok(
//                 CustomResponse.<MedicineResponse>builder()
//                         .success(true)
//                         .message("Medicine retrieved successfully")
//                         .data(medicine)
//                         .build()
//         );
//     }

//     @Operation(summary = "Create medicine", description = "Create a new medicine")
//     @ApiResponses({
//             @ApiResponse(responseCode = "201", description = "Created successfully"),
//             @ApiResponse(responseCode = "400", description = "Invalid data", 
//                     content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, 
//                     schema = @Schema(implementation = CustomResponse.class))),
//             @ApiResponse(responseCode = "409", description = "Medicine already exists", 
//                     content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, 
//                     schema = @Schema(implementation = CustomResponse.class)))
//     })
//     @PostMapping
//     public ResponseEntity<CustomResponse<MedicineResponse>> createMedicine(
//             @Parameter(description = "Medicine information to create", required = true) 
//             @Valid @RequestBody CreateMedicineRequest request) {
        
//         log.info("MedicineController | createMedicine | Creating new medicine with name: {}", request.getName());
//         MedicineResponse createdMedicine = medicineService.createMedicine(request);
        
//         return new ResponseEntity<>(
//                 CustomResponse.<MedicineResponse>builder()
//                         .success(true)
//                         .message("Medicine created successfully")
//                         .data(createdMedicine)
//                         .build(),
//                 HttpStatus.CREATED
//         );
//     }

//     @Operation(summary = "Update medicine", description = "Update medicine information by ID")
//     @ApiResponses({
//             @ApiResponse(responseCode = "200", description = "Updated successfully"),
//             @ApiResponse(responseCode = "400", description = "Invalid data", 
//                     content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, 
//                     schema = @Schema(implementation = CustomResponse.class))),
//             @ApiResponse(responseCode = "404", description = "Medicine not found", 
//                     content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, 
//                     schema = @Schema(implementation = CustomResponse.class))),
//             @ApiResponse(responseCode = "409", description = "Medicine already exists", 
//                     content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, 
//                     schema = @Schema(implementation = CustomResponse.class)))
//     })
//     @PutMapping("/{medicineId}")
//     public ResponseEntity<CustomResponse<MedicineResponse>> updateMedicine(
//             @Parameter(description = "Medicine ID", required = true) @PathVariable String medicineId,
//             @Parameter(description = "Updated information", required = true) 
//             @Valid @RequestBody UpdateMedicineRequest request) {
        
//         log.info("MedicineController | updateMedicine | Updating medicine with ID: {}", medicineId);
//         MedicineResponse updatedMedicine = medicineService.updateMedicine(medicineId, request);
        
//         return ResponseEntity.ok(
//                 CustomResponse.<MedicineResponse>builder()
//                         .success(true)
//                         .message("Medicine updated successfully")
//                         .data(updatedMedicine)
//                         .build()
//         );
//     }

//     @Operation(summary = "Delete medicine", description = "Delete medicine by ID")
//     @ApiResponses({
//             @ApiResponse(responseCode = "200", description = "Deleted successfully"),
//             @ApiResponse(responseCode = "404", description = "Medicine not found", 
//                     content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, 
//                     schema = @Schema(implementation = CustomResponse.class)))
//     })
//     @DeleteMapping("/{medicineId}")
//     public ResponseEntity<CustomResponse<Void>> deleteMedicine(
//             @Parameter(description = "Medicine ID", required = true) @PathVariable String medicineId) {
        
//         log.info("MedicineController | deleteMedicine | Deleting medicine with ID: {}", medicineId);
//         medicineService.deleteMedicine(medicineId);
        
//         return ResponseEntity.ok(
//                 CustomResponse.<Void>builder()
//                         .success(true)
//                         .message("Medicine deleted successfully")
//                         .build()
//         );
//     }

//     @Operation(summary = "Restore deleted medicine", description = "Restore a soft-deleted medicine")
//     @ApiResponses({
//             @ApiResponse(responseCode = "200", description = "Restored successfully"),
//             @ApiResponse(responseCode = "404", description = "Medicine not found", 
//                     content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, 
//                     schema = @Schema(implementation = CustomResponse.class)))
//     })
//     @PatchMapping("/{medicineId}/restore")
//     public ResponseEntity<CustomResponse<Void>> restoreMedicine(
//             @Parameter(description = "Medicine ID", required = true) @PathVariable String medicineId) {
        
//         log.info("MedicineController | restoreMedicine | Restoring medicine with ID: {}", medicineId);
//         medicineService.restoreMedicine(medicineId);
        
//         return ResponseEntity.ok(
//                 CustomResponse.<Void>builder()
//                         .success(true)
//                         .message("Medicine restored successfully")
//                         .build()
//         );
//     }
// }