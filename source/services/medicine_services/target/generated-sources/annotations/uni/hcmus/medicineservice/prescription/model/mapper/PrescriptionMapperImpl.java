package uni.hcmus.medicineservice.prescription.model.mapper;

import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import uni.hcmus.medicineservice.medicine.model.entity.Medicine;
import uni.hcmus.medicineservice.medicine.model.mapper.MedicineMapper;
import uni.hcmus.medicineservice.prescription.model.dto.CreatePrescriptionItemRequest;
import uni.hcmus.medicineservice.prescription.model.dto.CreatePrescriptionRequest;
import uni.hcmus.medicineservice.prescription.model.dto.PrescriptionItemResponse;
import uni.hcmus.medicineservice.prescription.model.dto.PrescriptionResponse;
import uni.hcmus.medicineservice.prescription.model.dto.UpdatePrescriptionRequest;
import uni.hcmus.medicineservice.prescription.model.entity.Prescription;
import uni.hcmus.medicineservice.prescription.model.entity.PrescriptionItem;
import uni.hcmus.medicineservice.prescription.model.enums.PrescriptionStatus;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-07-04T16:57:25+0700",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.42.50.v20250628-1110, environment: Java 21.0.7 (Eclipse Adoptium)"
)
@Component
public class PrescriptionMapperImpl implements PrescriptionMapper {

    @Autowired
    private MedicineMapper medicineMapper;

    @Override
    public Prescription toEntity(CreatePrescriptionRequest request) {
        if ( request == null ) {
            return null;
        }

        Prescription.PrescriptionBuilder<?, ?> prescription = Prescription.builder();

        prescription.medicalRecordId( request.getMedicalRecordId() );

        prescription.status( PrescriptionStatus.CREATED );
        prescription.isPaid( false );

        return prescription.build();
    }

    @Override
    public PrescriptionItem toEntity(CreatePrescriptionItemRequest request, Medicine medicine) {
        if ( request == null && medicine == null ) {
            return null;
        }

        PrescriptionItem.PrescriptionItemBuilder<?, ?> prescriptionItem = PrescriptionItem.builder();

        if ( request != null ) {
            prescriptionItem.dosageInstruction( request.getDosageInstruction() );
            prescriptionItem.quantity( request.getQuantity() );
        }
        prescriptionItem.medicine( medicine );

        return prescriptionItem.build();
    }

    @Override
    public void updateEntity(UpdatePrescriptionRequest request, Prescription prescription) {
        if ( request == null ) {
            return;
        }

        prescription.setMedicalRecordId( request.getMedicalRecordId() );
    }

    @Override
    public PrescriptionResponse toResponse(Prescription prescription) {
        if ( prescription == null ) {
            return null;
        }

        PrescriptionResponse.PrescriptionResponseBuilder prescriptionResponse = PrescriptionResponse.builder();

        prescriptionResponse.createdAt( prescription.getCreatedAt() );
        prescriptionResponse.isPaid( prescription.getIsPaid() );
        prescriptionResponse.items( toItemResponseList( prescription.getItems() ) );
        prescriptionResponse.medicalRecordId( prescription.getMedicalRecordId() );
        prescriptionResponse.prescriptionId( prescription.getPrescriptionId() );
        prescriptionResponse.status( prescription.getStatus() );
        prescriptionResponse.totalCost( prescription.getTotalCost() );
        prescriptionResponse.updatedAt( prescription.getUpdatedAt() );

        return prescriptionResponse.build();
    }

    @Override
    public List<PrescriptionResponse> toResponseList(List<Prescription> prescriptions) {
        if ( prescriptions == null ) {
            return null;
        }

        List<PrescriptionResponse> list = new ArrayList<PrescriptionResponse>( prescriptions.size() );
        for ( Prescription prescription : prescriptions ) {
            list.add( toResponse( prescription ) );
        }

        return list;
    }

    @Override
    public PrescriptionItemResponse toItemResponse(PrescriptionItem prescriptionItem) {
        if ( prescriptionItem == null ) {
            return null;
        }

        PrescriptionItemResponse.PrescriptionItemResponseBuilder prescriptionItemResponse = PrescriptionItemResponse.builder();

        prescriptionItemResponse.medicine( medicineMapper.toResponse( prescriptionItem.getMedicine() ) );
        prescriptionItemResponse.dosageInstruction( prescriptionItem.getDosageInstruction() );
        prescriptionItemResponse.prescriptionItemId( prescriptionItem.getPrescriptionItemId() );
        prescriptionItemResponse.quantity( prescriptionItem.getQuantity() );
        prescriptionItemResponse.totalCost( prescriptionItem.getTotalCost() );

        return prescriptionItemResponse.build();
    }

    @Override
    public List<PrescriptionItemResponse> toItemResponseList(List<PrescriptionItem> items) {
        if ( items == null ) {
            return null;
        }

        List<PrescriptionItemResponse> list = new ArrayList<PrescriptionItemResponse>( items.size() );
        for ( PrescriptionItem prescriptionItem : items ) {
            list.add( toItemResponse( prescriptionItem ) );
        }

        return list;
    }
}
