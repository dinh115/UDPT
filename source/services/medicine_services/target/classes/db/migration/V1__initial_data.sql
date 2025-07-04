-- Tạo bảng medicine theo đúng cấu trúc Entity
CREATE TABLE IF NOT EXISTS medicine (
    medicine_id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    supplier VARCHAR(255) NOT NULL,
    price DOUBLE PRECISION NOT NULL DEFAULT 0,
    stock_quantity INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- Tạo bảng prescription theo đúng cấu trúc Entity
CREATE TABLE IF NOT EXISTS prescription (
    prescription_id VARCHAR(36) PRIMARY KEY,
    medical_record_id VARCHAR(255),
    total_cost DOUBLE PRECISION NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL,
    is_paid BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- Tạo bảng prescription_item theo đúng cấu trúc Entity
CREATE TABLE IF NOT EXISTS prescription_item (
    prescription_item_id VARCHAR(36) PRIMARY KEY,
    prescription_id VARCHAR(36) NOT NULL,
    medicine_id VARCHAR(36) NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    dosage_instruction TEXT,
    total_cost DOUBLE PRECISION NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    
    CONSTRAINT fk_prescription_item_prescription 
        FOREIGN KEY (prescription_id) 
        REFERENCES prescription(prescription_id),
        
    CONSTRAINT fk_prescription_item_medicine 
        FOREIGN KEY (medicine_id) 
        REFERENCES medicine(medicine_id)
);

-- Tạo các chỉ mục (index) để tăng hiệu suất truy vấn
CREATE INDEX idx_medicine_name ON medicine(name);
CREATE INDEX idx_medicine_is_deleted ON medicine(is_deleted);

CREATE INDEX idx_prescription_medical_record_id ON prescription(medical_record_id);
CREATE INDEX idx_prescription_status ON prescription(status);
CREATE INDEX idx_prescription_is_paid ON prescription(is_paid);
CREATE INDEX idx_prescription_is_deleted ON prescription(is_deleted);

CREATE INDEX idx_prescription_item_prescription_id ON prescription_item(prescription_id);
CREATE INDEX idx_prescription_item_medicine_id ON prescription_item(medicine_id);
CREATE INDEX idx_prescription_item_is_deleted ON prescription_item(is_deleted);

-- Thêm dữ liệu mẫu cho bảng medicine (10 bản ghi)
INSERT INTO medicine (medicine_id, name, unit, supplier, price, stock_quantity, created_at, updated_at, is_deleted) VALUES
('a81d4e2e-bcf2-11ed-afa1-0242ac120002', 'Paracetamol 500mg', 'Viên', 'Công ty Dược phẩm A', 5000, 1000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
('a81d5036-bcf2-11ed-afa1-0242ac120002', 'Amoxicillin 500mg', 'Viên', 'Công ty Dược phẩm B', 8000, 800, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
('a81d519e-bcf2-11ed-afa1-0242ac120002', 'Omeprazole 20mg', 'Viên', 'Công ty Dược phẩm C', 12000, 500, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
('a81d52b6-bcf2-11ed-afa1-0242ac120002', 'Cetirizine 10mg', 'Viên', 'Công ty Dược phẩm D', 7000, 600, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
('a81d53c4-bcf2-11ed-afa1-0242ac120002', 'Vitamin C 500mg', 'Viên', 'Công ty Dược phẩm E', 3000, 2000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
('a81d54d2-bcf2-11ed-afa1-0242ac120002', 'Losartan 50mg', 'Viên', 'Công ty Dược phẩm F', 15000, 300, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
('a81d55e0-bcf2-11ed-afa1-0242ac120002', 'Salbutamol 2mg', 'Viên', 'Công ty Dược phẩm G', 9000, 400, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
('a81d5702-bcf2-11ed-afa1-0242ac120002', 'Metformin 500mg', 'Viên', 'Công ty Dược phẩm H', 6000, 700, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
('a81d5810-bcf2-11ed-afa1-0242ac120002', 'Ibuprofen 400mg', 'Viên', 'Công ty Dược phẩm I', 7500, 900, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
('a81d591e-bcf2-11ed-afa1-0242ac120002', 'Alprazolam 0.5mg', 'Viên', 'Công ty Dược phẩm J', 20000, 200, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false);

-- Thêm dữ liệu mẫu cho bảng prescription (10 bản ghi)
INSERT INTO prescription (prescription_id, medical_record_id, total_cost, status, is_paid, created_at, updated_at, is_deleted) VALUES
('b81d4e2e-bcf2-11ed-afa1-0242ac120002', 'MR-20230101-001', 57000, 'CREATED', false, '2023-01-10 08:30:00', CURRENT_TIMESTAMP, false),
('b81d5036-bcf2-11ed-afa1-0242ac120002', 'MR-20230215-002', 132000, 'READY', true, '2023-02-15 09:45:00', CURRENT_TIMESTAMP, false),
('b81d519e-bcf2-11ed-afa1-0242ac120002', 'MR-20230310-003', 48000, 'PICKED_UP', true, '2023-03-10 11:20:00', CURRENT_TIMESTAMP, false),
('b81d52b6-bcf2-11ed-afa1-0242ac120002', 'MR-20230405-004', 84000, 'CREATED', false, '2023-04-05 14:15:00', CURRENT_TIMESTAMP, false),
('b81d53c4-bcf2-11ed-afa1-0242ac120002', 'MR-20230520-005', 69000, 'READY', false, '2023-05-20 10:30:00', CURRENT_TIMESTAMP, false),
('b81d54d2-bcf2-11ed-afa1-0242ac120002', 'MR-20230615-006', 120000, 'PICKED_UP', true, '2023-06-15 16:45:00', CURRENT_TIMESTAMP, false),
('b81d55e0-bcf2-11ed-afa1-0242ac120002', 'MR-20230710-007', 93000, 'CREATED', false, '2023-07-10 09:00:00', CURRENT_TIMESTAMP, false),
('b81d5702-bcf2-11ed-afa1-0242ac120002', 'MR-20230805-008', 112000, 'READY', true, '2023-08-05 13:20:00', CURRENT_TIMESTAMP, false),
('b81d5810-bcf2-11ed-afa1-0242ac120002', 'MR-20230920-009', 75000, 'PICKED_UP', true, '2023-09-20 15:10:00', CURRENT_TIMESTAMP, false),
('b81d591e-bcf2-11ed-afa1-0242ac120002', 'MR-20231015-010', 50000, 'CREATED', false, '2023-10-15 08:45:00', CURRENT_TIMESTAMP, false);

-- Thêm dữ liệu mẫu cho bảng prescription_item (10 bản ghi)
INSERT INTO prescription_item (prescription_item_id, prescription_id, medicine_id, quantity, dosage_instruction, total_cost, created_at, updated_at, is_deleted) VALUES
('c81d4e2e-bcf2-11ed-afa1-0242ac120002', 'b81d4e2e-bcf2-11ed-afa1-0242ac120002', 'a81d4e2e-bcf2-11ed-afa1-0242ac120002', 3, 'Uống 1 viên mỗi 6 giờ khi sốt trên 38.5°C', 15000, '2023-01-10 08:30:00', CURRENT_TIMESTAMP, false),
('c81d5036-bcf2-11ed-afa1-0242ac120002', 'b81d4e2e-bcf2-11ed-afa1-0242ac120002', 'a81d5036-bcf2-11ed-afa1-0242ac120002', 2, 'Uống 1 viên sáng và tối sau khi ăn', 16000, '2023-01-10 08:30:00', CURRENT_TIMESTAMP, false),
('c81d519e-bcf2-11ed-afa1-0242ac120002', 'b81d5036-bcf2-11ed-afa1-0242ac120002', 'a81d5036-bcf2-11ed-afa1-0242ac120002', 3, 'Uống 1 viên mỗi 8 giờ sau khi ăn', 24000, '2023-02-15 09:45:00', CURRENT_TIMESTAMP, false),
('c81d52b6-bcf2-11ed-afa1-0242ac120002', 'b81d5036-bcf2-11ed-afa1-0242ac120002', 'a81d519e-bcf2-11ed-afa1-0242ac120002', 2, 'Uống 1 viên trước bữa sáng', 24000, '2023-02-15 09:45:00', CURRENT_TIMESTAMP, false),
('c81d53c4-bcf2-11ed-afa1-0242ac120002', 'b81d519e-bcf2-11ed-afa1-0242ac120002', 'a81d4e2e-bcf2-11ed-afa1-0242ac120002', 4, 'Uống 1 viên khi sốt trên 38°C, cách nhau ít nhất 6 giờ', 20000, '2023-03-10 11:20:00', CURRENT_TIMESTAMP, false),
('c81d54d2-bcf2-11ed-afa1-0242ac120002', 'b81d52b6-bcf2-11ed-afa1-0242ac120002', 'a81d519e-bcf2-11ed-afa1-0242ac120002', 2, 'Uống 1 viên trước bữa sáng và tối', 24000, '2023-04-05 14:15:00', CURRENT_TIMESTAMP, false),
('c81d55e0-bcf2-11ed-afa1-0242ac120002', 'b81d53c4-bcf2-11ed-afa1-0242ac120002', 'a81d4e2e-bcf2-11ed-afa1-0242ac120002', 3, 'Uống 1 viên mỗi 6 giờ khi đau', 15000, '2023-05-20 10:30:00', CURRENT_TIMESTAMP, false),
('c81d5702-bcf2-11ed-afa1-0242ac120002', 'b81d54d2-bcf2-11ed-afa1-0242ac120002', 'a81d54d2-bcf2-11ed-afa1-0242ac120002', 3, 'Uống 1 viên mỗi sáng', 45000, '2023-06-15 16:45:00', CURRENT_TIMESTAMP, false),
('c81d5810-bcf2-11ed-afa1-0242ac120002', 'b81d55e0-bcf2-11ed-afa1-0242ac120002', 'a81d4e2e-bcf2-11ed-afa1-0242ac120002', 3, 'Uống 1 viên mỗi 6 giờ khi sốt', 15000, '2023-07-10 09:00:00', CURRENT_TIMESTAMP, false),
('c81d591e-bcf2-11ed-afa1-0242ac120002', 'b81d5702-bcf2-11ed-afa1-0242ac120002', 'a81d5036-bcf2-11ed-afa1-0242ac120002', 4, 'Uống 1 viên mỗi 8 giờ sau khi ăn', 32000, '2023-08-05 13:20:00', CURRENT_TIMESTAMP, false);