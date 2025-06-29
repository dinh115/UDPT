package uni.hcmus.medicineservice.prescription.exception;

import uni.hcmus.medicineservice.prescription.model.enums.PrescriptionStatus;

public class InvalidStatusTransitionException extends RuntimeException {
    public InvalidStatusTransitionException(PrescriptionStatus currentStatus, PrescriptionStatus newStatus) {
        super("Cannot transition from status " + currentStatus + " to " + newStatus);
    }
}