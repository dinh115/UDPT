package uni.hcmus.medicineservice.medicine.exception;

public class MedicineNotFoundException extends RuntimeException {
    public MedicineNotFoundException(String medicineId) {
        super("Medicine not found with ID: " + medicineId);
    }
}