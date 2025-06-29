// package uni.hcmus.medicineservice.prescription.controller;

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
// import uni.hcmus.medicineservice.prescription.model.dto.*;
// import uni.hcmus.medicineservice.prescription.model.enums.PrescriptionStatus;
// import uni.hcmus.medicineservice.prescription.service.PrescriptionService;

// import java.util.HashMap;
// import java.util.List;
// import java.util.Map;

// @RestController
// @RequestMapping("/prescriptions")
// @RequiredArgsConstructor
// @Slf4j
// @Tag(name = "Prescriptions", description = "Prescription management APIs")
// public class PrescriptionController {

//     private final PrescriptionService prescriptionService;

//     @Operation(summary = "Get all prescriptions", description = "Retrieve a list of all prescriptions")
//     @ApiResponse(responseCode = "200", description = "Success")
//     @GetMapping("/all")
//     public ResponseEntity<CustomResponse<List<PrescriptionResponse>>> getAllPrescriptions() {
//         log.info("PrescriptionController | getAllPrescriptions | Getting all prescriptions");
//         List<PrescriptionResponse> prescriptions = prescriptionService.getAllPrescriptions();
//         return ResponseEntity.ok(
//                 CustomResponse.<List<PrescriptionResponse>>builder()
//                         .success(true)
//                         .message("Prescriptions retrieved successfully")
//                         .data(prescriptions)
//                         .build()
//         );
//     }

//     @Operation(summary = "Search prescriptions", description = "Search prescriptions with filters and pagination")
//     @ApiResponses({
//             @ApiResponse(responseCode = "200", description = "Success"),
//             @ApiResponse(responseCode = "400", description = "Invalid parameters",
//                     content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
//                     schema = @Schema(implementation = CustomResponse.class)))
//     })
//     @GetMapping("/search")
//     public ResponseEntity<CustomResponse<Map<String, Object>>> searchPrescriptions(
//             @Parameter(description = "Search keyword (medical record ID)")
//             @RequestParam(required = false) String keyword,
            
//             @Parameter(description = "Prescription status filter")
//             @RequestParam(required = false) PrescriptionStatus status,
            
//             @Parameter(description = "Payment status filter")
//             @RequestParam(required = false) Boolean isPaid,
            
//             @Parameter(description = "Page number")
//             @RequestParam(defaultValue = "0") int page,
            
//             @Parameter(description = "Items per page")
//             @RequestParam(defaultValue = "10") int size,
            
//             @Parameter(description = "Sort field")
//             @RequestParam(defaultValue = "createdAt") String sortBy,
            
//             @Parameter(description = "Sort direction (ASC/DESC)")
//             @RequestParam(defaultValue = "DESC") String sortDir) {
        
//         log.info("PrescriptionController | searchPrescriptions | Searching with keyword: {}, status: {}, isPaid: {}", 
//                 keyword, status, isPaid);
        
//         Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
//         Pageable pageable = PageRequest.of(page, size, sort);
        
//         Page<PrescriptionResponse> prescriptionPage = 
//                 prescriptionService.searchPrescriptions(keyword, status, isPaid, pageable);

//         Map<String, Object> response = new HashMap<>();
//         response.put("prescriptions", prescriptionPage.getContent());
//         response.put("currentPage", prescriptionPage.getNumber());
//         response.put("totalItems", prescriptionPage.getTotalElements());
//         response.put("totalPages", prescriptionPage.getTotalPages());

//         return ResponseEntity.ok(
//                 CustomResponse.<Map<String, Object>>builder()
//                         .success(true)
//                         .message("Prescriptions searched successfully")
//                         .data(response)
//                         .build()
//         );
//     }

//     @Operation(summary = "Get prescription by ID", description = "Get detailed information of a prescription by its ID")
//     @ApiResponses({
//             @ApiResponse(responseCode = "200", description = "Success"),
//             @ApiResponse(responseCode = "404", description = "Prescription not found",
//                     content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
//                     schema = @Schema(implementation = CustomResponse.class)))
//     })
//     @GetMapping("/{prescriptionId}")
//     public ResponseEntity<CustomResponse<PrescriptionResponse>> getPrescriptionById(
//             @Parameter(description = "Prescription ID", required = true) @PathVariable String prescriptionId) {
        
//         log.info("PrescriptionController | getPrescriptionById | Getting prescription with ID: {}", prescriptionId);
//         PrescriptionResponse prescription = prescriptionService.getPrescriptionById(prescriptionId);
        
//         return ResponseEntity.ok(
//                 CustomResponse.<PrescriptionResponse>builder()
//                         .success(true)
//                         .message("Prescription retrieved successfully")
//                         .data(prescription)
//                         .build()
//         );
//     }

//     @Operation(summary = "Create prescription", description = "Create a new prescription")
//     @ApiResponses({
//             @ApiResponse(responseCode = "201", description = "Created successfully"),
//             @ApiResponse(responseCode = "400", description = "Invalid data",
//                     content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
//                     schema = @Schema(implementation = CustomResponse.class)))
//     })
//     @PostMapping
//     public ResponseEntity<CustomResponse<PrescriptionResponse>> createPrescription(
//             @Parameter(description = "Prescription information to create", required = true)
//             @Valid @RequestBody CreatePrescriptionRequest request) {
        
//         log.info("PrescriptionController | createPrescription | Creating prescription");
//         PrescriptionResponse createdPrescription = prescriptionService.createPrescription(request);
        
//         return new ResponseEntity<>(
//                 CustomResponse.<PrescriptionResponse>builder()
//                         .success(true)
//                         .message("Prescription created successfully")
//                         .data(createdPrescription)
//                         .build(),
//                 HttpStatus.CREATED
//         );
//     }

//     @Operation(summary = "Update prescription", description = "Update prescription information")
//     @ApiResponses({
//             @ApiResponse(responseCode = "200", description = "Updated successfully"),
//             @ApiResponse(responseCode = "400", description = "Invalid data",
//                     content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
//                     schema = @Schema(implementation = CustomResponse.class))),
//             @ApiResponse(responseCode = "404", description = "Prescription not found",
//                     content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
//                     schema = @Schema(implementation = CustomResponse.class)))
//     })
//     @PutMapping("/{prescriptionId}")
//     public ResponseEntity<CustomResponse<PrescriptionResponse>> updatePrescription(
//             @Parameter(description = "Prescription ID", required = true) @PathVariable String prescriptionId,
//             @Parameter(description = "Updated information", required = true)
//             @Valid @RequestBody UpdatePrescriptionRequest request) {
        
//         log.info("PrescriptionController | updatePrescription | Updating prescription with ID: {}", prescriptionId);
//         PrescriptionResponse updatedPrescription = prescriptionService.updatePrescription(prescriptionId, request);
        
//         return ResponseEntity.ok(
//                 CustomResponse.<PrescriptionResponse>builder()
//                         .success(true)
//                         .message("Prescription updated successfully")
//                         .data(updatedPrescription)
//                         .build()
//         );
//     }

//     @Operation(summary = "Update prescription status", description = "Update the status of a prescription")
//     @ApiResponses({
//             @ApiResponse(responseCode = "200", description = "Status updated successfully"),
//             @ApiResponse(responseCode = "400", description = "Invalid status transition",
//                     content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
//                     schema = @Schema(implementation = CustomResponse.class))),
//             @ApiResponse(responseCode = "404", description = "Prescription not found",
//                     content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
//                     schema = @Schema(implementation = CustomResponse.class)))
//     })
//     @PatchMapping("/{prescriptionId}/status")
//     public ResponseEntity<CustomResponse<PrescriptionResponse>> updatePrescriptionStatus(
//             @Parameter(description = "Prescription ID", required = true) @PathVariable String prescriptionId,
//             @Parameter(description = "New status information", required = true)
//             @Valid @RequestBody UpdatePrescriptionStatusRequest request) {
        
//         log.info("PrescriptionController | updatePrescriptionStatus | Updating status of prescription with ID: {} to {}",
//                 prescriptionId, request.getStatus());
        
//         PrescriptionResponse updatedPrescription = prescriptionService.updatePrescriptionStatus(prescriptionId, request);
        
//         return ResponseEntity.ok(
//                 CustomResponse.<PrescriptionResponse>builder()
//                         .success(true)
//                         .message("Prescription status updated successfully")
//                         .data(updatedPrescription)
//                         .build()
//         );
//     }

//     @Operation(summary = "Update prescription payment", description = "Update the payment status of a prescription")
//     @ApiResponses({
//             @ApiResponse(responseCode = "200", description = "Payment status updated successfully"),
//             @ApiResponse(responseCode = "404", description = "Prescription not found",
//                     content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
//                     schema = @Schema(implementation = CustomResponse.class)))
//     })
//     @PatchMapping("/{prescriptionId}/payment")
//     public ResponseEntity<CustomResponse<PrescriptionResponse>> updatePrescriptionPayment(
//             @Parameter(description = "Prescription ID", required = true) @PathVariable String prescriptionId,
//             @Parameter(description = "Payment status information", required = true)
//             @Valid @RequestBody UpdatePrescriptionPaymentRequest request) {
        
//         log.info("PrescriptionController | updatePrescriptionPayment | Updating payment status of prescription with ID: {} to {}",
//                 prescriptionId, request.getIsPaid());
        
//         PrescriptionResponse updatedPrescription = prescriptionService.updatePrescriptionPayment(prescriptionId, request);
        
//         return ResponseEntity.ok(
//                 CustomResponse.<PrescriptionResponse>builder()
//                         .success(true)
//                         .message("Prescription payment status updated successfully")
//                         .data(updatedPrescription)
//                         .build()
//         );
//     }

//     @Operation(summary = "Delete prescription", description = "Delete prescription by ID")
//     @ApiResponses({
//             @ApiResponse(responseCode = "200", description = "Deleted successfully"),
//             @ApiResponse(responseCode = "404", description = "Prescription not found",
//                     content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
//                     schema = @Schema(implementation = CustomResponse.class)))
//     })
//     @DeleteMapping("/{prescriptionId}")
//     public ResponseEntity<CustomResponse<Void>> deletePrescription(
//             @Parameter(description = "Prescription ID", required = true) @PathVariable String prescriptionId) {
        
//         log.info("PrescriptionController | deletePrescription | Deleting prescription with ID: {}", prescriptionId);
//         prescriptionService.deletePrescription(prescriptionId);
        
//         return ResponseEntity.ok(
//                 CustomResponse.<Void>builder()
//                         .success(true)
//                         .message("Prescription deleted successfully")
//                         .build()
//         );
//     }

//     @Operation(summary = "Restore deleted prescription", description = "Restore a soft-deleted prescription")
//     @ApiResponses({
//             @ApiResponse(responseCode = "200", description = "Restored successfully"),
//             @ApiResponse(responseCode = "404", description = "Prescription not found",
//                     content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
//                     schema = @Schema(implementation = CustomResponse.class)))
//     })
//     @PatchMapping("/{prescriptionId}/restore")
//     public ResponseEntity<CustomResponse<Void>> restorePrescription(
//             @Parameter(description = "Prescription ID", required = true) @PathVariable String prescriptionId) {
        
//         log.info("PrescriptionController | restorePrescription | Restoring prescription with ID: {}", prescriptionId);
//         prescriptionService.restorePrescription(prescriptionId);
        
//         return ResponseEntity.ok(
//                 CustomResponse.<Void>builder()
//                         .success(true)
//                         .message("Prescription restored successfully")
//                         .build()
//         );
//     }

//     @Operation(summary = "Get prescriptions by status", description = "Get all prescriptions with a specific status")
//     @ApiResponse(responseCode = "200", description = "Success")
//     @GetMapping("/status/{status}")
//     public ResponseEntity<CustomResponse<List<PrescriptionResponse>>> getPrescriptionsByStatus(
//             @Parameter(description = "Prescription status", required = true)
//             @PathVariable PrescriptionStatus status) {
        
//         log.info("PrescriptionController | getPrescriptionsByStatus | Getting prescriptions with status: {}", status);
//         List<PrescriptionResponse> prescriptions = prescriptionService.getPrescriptionsByStatus(status);
        
//         return ResponseEntity.ok(
//                 CustomResponse.<List<PrescriptionResponse>>builder()
//                         .success(true)
//                         .message("Prescriptions retrieved successfully")
//                         .data(prescriptions)
//                         .build()
//         );
//     }

//     @Operation(summary = "Get prescriptions by payment status", description = "Get all prescriptions with a specific payment status")
//     @ApiResponse(responseCode = "200", description = "Success")
//     @GetMapping("/payment/{isPaid}")
//     public ResponseEntity<CustomResponse<List<PrescriptionResponse>>> getPrescriptionsByPaymentStatus(
//             @Parameter(description = "Payment status (true/false)", required = true)
//             @PathVariable Boolean isPaid) {
        
//         log.info("PrescriptionController | getPrescriptionsByPaymentStatus | Getting prescriptions with payment status: {}", isPaid);
//         List<PrescriptionResponse> prescriptions = prescriptionService.getPrescriptionsByPaymentStatus(isPaid);
        
//         return ResponseEntity.ok(
//                 CustomResponse.<List<PrescriptionResponse>>builder()
//                         .success(true)
//                         .message("Prescriptions retrieved successfully")
//                         .data(prescriptions)
//                         .build()
//         );
//     }
// }