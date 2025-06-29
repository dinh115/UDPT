package uni.hcmus.medicineservice.medicine.exception;

public class MedicineAlreadyExistsException extends RuntimeException {
    public MedicineAlreadyExistsException(String name) {
        super("Medicine with name '" + name + "' already exists");
    }
}