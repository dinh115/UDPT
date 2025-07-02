package uni.hcmus.medicineservice.prescription.model.enums;

public enum PrescriptionStatus {
    CREATED("Created"),
    READY("Ready"),
    PICKED_UP("Picked Up");

    private final String displayName;

    PrescriptionStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}