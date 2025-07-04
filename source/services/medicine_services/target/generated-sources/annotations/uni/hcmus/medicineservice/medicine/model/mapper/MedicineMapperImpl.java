package uni.hcmus.medicineservice.medicine.model.mapper;

import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;
import uni.hcmus.medicineservice.medicine.model.dto.CreateMedicineRequest;
import uni.hcmus.medicineservice.medicine.model.dto.MedicineResponse;
import uni.hcmus.medicineservice.medicine.model.dto.UpdateMedicineRequest;
import uni.hcmus.medicineservice.medicine.model.entity.Medicine;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-07-04T15:34:25+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.14 (Amazon.com Inc.)"
)
@Component
public class MedicineMapperImpl implements MedicineMapper {

    @Override
    public MedicineResponse toResponse(Medicine medicine) {
        if ( medicine == null ) {
            return null;
        }

        MedicineResponse.MedicineResponseBuilder medicineResponse = MedicineResponse.builder();

        medicineResponse.medicineId( medicine.getMedicineId() );
        medicineResponse.name( medicine.getName() );
        medicineResponse.unit( medicine.getUnit() );
        medicineResponse.supplier( medicine.getSupplier() );
        medicineResponse.price( medicine.getPrice() );
        medicineResponse.stockQuantity( medicine.getStockQuantity() );
        medicineResponse.createdAt( medicine.getCreatedAt() );
        medicineResponse.updatedAt( medicine.getUpdatedAt() );

        return medicineResponse.build();
    }

    @Override
    public Medicine toEntity(CreateMedicineRequest request) {
        if ( request == null ) {
            return null;
        }

        Medicine.MedicineBuilder<?, ?> medicine = Medicine.builder();

        medicine.name( request.getName() );
        medicine.unit( request.getUnit() );
        medicine.supplier( request.getSupplier() );
        if ( request.getPrice() != null ) {
            medicine.price( request.getPrice() );
        }
        if ( request.getStockQuantity() != null ) {
            medicine.stockQuantity( request.getStockQuantity() );
        }

        return medicine.build();
    }

    @Override
    public void updateEntity(UpdateMedicineRequest request, Medicine medicine) {
        if ( request == null ) {
            return;
        }

        medicine.setName( request.getName() );
        medicine.setUnit( request.getUnit() );
        medicine.setSupplier( request.getSupplier() );
        if ( request.getPrice() != null ) {
            medicine.setPrice( request.getPrice() );
        }
        if ( request.getStockQuantity() != null ) {
            medicine.setStockQuantity( request.getStockQuantity() );
        }
    }
}
