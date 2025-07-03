CREATE TABLE appointments_tab (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id CHAR(36) NOT NULL,-- UUID
    doctor_id CHAR(36) NOT NULL,-- UUID
    appointment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status ENUM('pending', 'confirmed', 'cancelled') NOT NULL DEFAULT 'pending',
    notes TEXT,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
);

--create procedure:
DELIMITER $$

CREATE PROCEDURE AcceptAppointment(IN p_appointment_id CHAR(36))
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
    SELECT doctor_id, appointment_date, start_time, status
    INTO v_doctor_id, v_appointment_date, v_start_time, v_current_status
    FROM appointments_tab
    WHERE appointment_id = p_appointment_id
    FOR UPDATE; -- Lock the row to prevent concurrent modifications

    -- Check if appointment was found
    IF v_doctor_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Appointment not found.';
        ROLLBACK;
    ELSEIF v_current_status != 'pending' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cannot accept appointment. It is not in a pending state.';
        ROLLBACK;
    END IF;

    -- Step 3: Check for time slot conflicts with 'confirmed' appointments
    SELECT COUNT(*)
    INTO v_confirmed_conflict_count
    FROM appointments_tab
    WHERE doctor_id = v_doctor_id
      AND appointment_date = v_appointment_date
      AND start_time = v_start_time
      AND status = 'confirmed'
      AND appointment_id != p_appointment_id;

    IF v_confirmed_conflict_count > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Time slot conflict detected. Another appointment is already confirmed.';
        ROLLBACK;
    END IF;

    -- Step 4: Cancel all other conflicting 'pending' appointments for the same time slot
    UPDATE appointments_tab
    SET status = 'cancelled',
        updated_at = NOW()
    WHERE doctor_id = v_doctor_id
      AND appointment_date = v_appointment_date
      AND start_time = v_start_time
      AND status = 'pending'
      AND appointment_id != p_appointment_id;

    -- Step 5: Accept the original appointment
    UPDATE appointments_tab
    SET status = 'confirmed',
        updated_at = NOW()
    WHERE appointment_id = p_appointment_id;

    -- Commit the transaction if all steps are successful
    COMMIT;

END$$

DELIMITER ;