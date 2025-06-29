package uni.hcmus.medicineservice.prescription.exception;

public class PrescriptionNotFoundException extends RuntimeException {
    public PrescriptionNotFoundException(String prescriptionId) {
        super("Prescription not found with ID: " + prescriptionId);
    }
}