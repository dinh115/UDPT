ALTER DATABASE logs CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE logs.email_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255),
    type ENUM('reminder', 'prescription'),
    status ENUM('success', 'failed'),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE logs.user (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255),
    firstname VARCHAR(255),
    lastname VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE logs.appointments_tab (
	appointment_id char(36) NOT NULL,
    id int AUTO_INCREMENT PRIMARY KEY,
    patient_id CHAR(36) NOT NULL,-- UUID
    doctor_id CHAR(36) NOT NULL,-- UUID
    appointment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status ENUM('pending', 'confirmed', 'cancelled') NOT NULL DEFAULT 'pending',
    notes TEXT,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
)CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE logs;

DELIMITER $$

CREATE DEFINER=`admin` PROCEDURE `AcceptAppointment` (IN `p_appointment_id` CHAR(36))
BEGIN
    -- Declare variables to hold appointment details
    DECLARE v_doctor_id CHAR(36);
    DECLARE v_appointment_date DATE;
    DECLARE v_start_time TIME;
    DECLARE v_current_status ENUM('pending', 'confirmed', 'cancelled');
    DECLARE v_confirmed_conflict_count INT;

    -- Start a transaction to ensure all operations are atomic
    START TRANSACTION;

    -- Step 1 & 2: Check if the appointment exists and is 'pending'
    -- Lock the row to prevent concurrent modifications using FOR UPDATE
    SELECT doctor_id, appointment_date, start_time, status
    INTO v_doctor_id, v_appointment_date, v_start_time, v_current_status
    FROM appointments_tab
    WHERE appointment_id = p_appointment_id
    FOR UPDATE;

    -- Check if appointment was found. If not, signal an error and rollback.
    IF v_doctor_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Appointment not found.';
        ROLLBACK;
    -- Check if the appointment is in a 'pending' state. If not, signal an error and rollback.
    ELSEIF v_current_status != 'pending' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cannot accept appointment. It is not in a pending state.';
        ROLLBACK;
    END IF;

    -- Step 3: Check for time slot conflicts with already 'confirmed' appointments for the same doctor and time.
    SELECT COUNT(*)
    INTO v_confirmed_conflict_count
    FROM appointments_tab
    WHERE doctor_id = v_doctor_id
      AND appointment_date = v_appointment_date
      AND start_time = v_start_time
      AND status = 'confirmed'
      AND appointment_id != p_appointment_id; -- Exclude the current appointment being processed

    -- If a confirmed conflict is found, signal an error and rollback.
    IF v_confirmed_conflict_count > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Time slot conflict detected. Another appointment is already confirmed.';
        ROLLBACK;
    END IF;

    -- Step 4: Cancel all other conflicting 'pending' appointments for the same doctor and time slot.
    -- This ensures only one appointment is confirmed for a given slot.
    UPDATE appointments_tab
    SET status = 'cancelled',
        updated_at = NOW() -- Update the timestamp for these cancelled appointments
    WHERE doctor_id = v_doctor_id
      AND appointment_date = v_appointment_date
      AND start_time = v_start_time
      AND status = 'pending'
      AND appointment_id != p_appointment_id; -- Exclude the current appointment being accepted

    -- Step 5: Accept (confirm) the original appointment.
    UPDATE appointments_tab
    SET status = 'confirmed',
        updated_at = NOW() -- Update the timestamp for the confirmed appointment
    WHERE appointment_id = p_appointment_id;

    -- Commit the transaction if all steps are successful, making all changes permanent.
    COMMIT;

END$$

DELIMITER ;

SET NAMES 'utf8mb4';

INSERT INTO logs.user (id, email, firstname, lastname, created_at) VALUES
('patient_uuid_002', 'tranvanb@example.com', 'Trần Văn', 'B', NOW()),
('patient_uuid_003', 'lethic@example.com', 'Lê Thị', 'C', NOW()),
('doctor_uuid_002', 'john.doe@example.com', 'John', 'Doe', NOW()),
('doctor_uuid_003', 'emily.white@example.com', 'Emily', 'White', NOW());
('patient_uuid_004', 'nguyendinhphuongdai@gmail.com', 'Trần Văn', 'A', NOW());



INSERT INTO logs.appointments_tab (appointment_id, patient_id, doctor_id, appointment_date, start_time, end_time, status, notes, created_at, updated_at) VALUES
-- --- Happy Path (đã xác nhận, trong vòng 3 ngày tới) ---
-- Lịch hẹn 1: Nguyễn Văn A với Dr. Sarah Smith vào ngày 08/07/2025
('app_uuid_001', 'patient_uuid_001', 'doctor_uuid_001', '2025-07-08', '10:00:00', '11:00:00', 'confirmed', 'Kiểm tra định kỳ', NOW(), NOW()),
-- Lịch hẹn 2: Trần Văn B với Dr. John Doe vào ngày 07/07/2025
('app_uuid_004', 'patient_uuid_002', 'doctor_uuid_002', '2025-07-07', '14:30:00', '15:00:00', 'confirmed', 'Khám tổng quát', NOW(), NOW()),
-- Lịch hẹn 3: Lê Thị C với Dr. Emily White vào ngày 09/07/2025 (Ngày cuối cùng trong phạm vi 3 ngày)
('app_uuid_005', 'patient_uuid_003', 'doctor_uuid_003', '2025-07-09', '09:00:00', '09:45:00', 'confirmed', 'Tư vấn dinh dưỡng', NOW(), NOW()),

-- --- Lịch hẹn không đạt điều kiện ngày (đã xác nhận nhưng ngoài 3 ngày tới) ---
-- Lịch hẹn 4: Quá xa trong tương lai (sau 3 ngày)
('app_uuid_002', 'patient_uuid_001', 'doctor_uuid_001', '2025-07-15', '14:00:00', '15:00:00', 'confirmed', 'Tái khám', NOW(), NOW()),
-- Lịch hẹn 5: Đã diễn ra trong quá khứ
('app_uuid_006','patient_uuid_002', 'doctor_uuid_002', '2025-07-01', '08:00:00', '08:30:00', 'confirmed', 'Khám mắt', NOW(), NOW()),

-- --- Lịch hẹn không đạt điều kiện trạng thái (trong 3 ngày tới nhưng pending/cancelled) ---
-- Lịch hẹn 6: Đang chờ (pending)
('app_uuid_003','patient_uuid_001', 'doctor_uuid_001', '2025-07-07', '09:00:00', '10:00:00', 'pending', 'Khám lần đầu', NOW(), NOW()),
-- Lịch hẹn 7: Đã hủy (cancelled)
('app_uuid_007','patient_uuid_003', 'doctor_uuid_003', '2025-07-08', '16:00:00', '16:45:00', 'cancelled', 'Hủy do bận', NOW(), NOW());

INSERT INTO logs.appointments_tab (appointment_id, patient_id, doctor_id, appointment_date, start_time, end_time, status, notes, created_at, updated_at) VALUES
-- --- Happy Path (đã xác nhận, trong vòng 3 ngày tới) ---
-- Lịch hẹn 1: Nguyễn Văn A với Dr. Sarah Smith vào ngày 08/07/2025
('app_uuid_010', 'patient_uuid_004', 'doctor_uuid_002', '2025-07-13', '10:00:00', '11:00:00', 'confirmed', 'Kiểm tra định kỳ', NOW(), NOW());

