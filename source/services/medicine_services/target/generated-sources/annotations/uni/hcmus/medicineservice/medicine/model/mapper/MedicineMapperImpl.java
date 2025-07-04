package uni.hcmus.medicineservice.medicine.model.mapper;

import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;
import uni.hcmus.medicineservice.medicine.model.dto.CreateMedicineRequest;
import uni.hcmus.medicineservice.medicine.model.dto.MedicineResponse;
import uni.hcmus.medicineservice.medicine.model.dto.UpdateMedicineRequest;
import uni.hcmus.medicineservice.medicine.model.entity.Medicine;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-07-05T01:40:10+0700",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.42.50.v20250628-1110, environment: Java 21.0.7 (Eclipse Adoptium)"
)
@Component
public class MedicineMapperImpl implements MedicineMapper {

    @Override
    public MedicineResponse toResponse(Medicine medicine) {
        if ( medicine == null ) {
            return null;
        }

        MedicineResponse.MedicineResponseBuilder medicineResponse = MedicineResponse.builder();

        medicineResponse.createdAt( medicine.getCreatedAt() );
        medicineResponse.medicineId( medicine.getMedicineId() );
        medicineResponse.name( medicine.getName() );
        medicineResponse.price( medicine.getPrice() );
        medicineResponse.stockQuantity( medicine.getStockQuantity() );
        medicineResponse.supplier( medicine.getSupplier() );
        medicineResponse.unit( medicine.getUnit() );
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
        if ( request.getPrice() != null ) {
            medicine.price( request.getPrice() );
        }
        if ( request.getStockQuantity() != null ) {
            medicine.stockQuantity( request.getStockQuantity() );
        }
        medicine.supplier( request.getSupplier() );
        medicine.unit( request.getUnit() );

        return medicine.build();
    }

    @Override
    public void updateEntity(UpdateMedicineRequest request, Medicine medicine) {
        if ( request == null ) {
            return;
        }

        medicine.setName( request.getName() );
        if ( request.getPrice() != null ) {
            medicine.setPrice( request.getPrice() );
        }
        if ( request.getStockQuantity() != null ) {
            medicine.setStockQuantity( request.getStockQuantity() );
        }
        medicine.setSupplier( request.getSupplier() );
        medicine.setUnit( request.getUnit() );
    }
}
