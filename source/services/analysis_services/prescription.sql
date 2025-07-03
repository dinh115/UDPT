CREATE TABLE prescription (
    id INT AUTO_INCREMENT PRIMARY KEY,
    prescription_id CHAR(36), -- UUID
    medical_record_id VARCHAR(255),
    total_cost DOUBLE NOT NULL,
    status ENUM('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED') NOT NULL, -- Cần xác định rõ các giá trị enum
    is_paid BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME,
    updated_at DATETIME,
    is_deleted BOOLEAN DEFAULT FALSE
);
