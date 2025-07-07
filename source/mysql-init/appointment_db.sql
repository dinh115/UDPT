-- phpMyAdmin SQL Dump
-- version 4.9.5
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jul 04, 2025 at 10:21 AM
-- Server version: 5.7.24
-- PHP Version: 7.4.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `appointment_db`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=admin PROCEDURE `AcceptAppointment` (IN `p_appointment_id` CHAR(36))  BEGIN
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

-- --------------------------------------------------------

--
-- Table structure for table `appointments_tab`
--

CREATE TABLE `appointments_tab` (
  `appointment_id` char(36) NOT NULL,
  `id` int(11) NOT NULL,
  `patient_id` char(36) NOT NULL,
  `doctor_id` char(36) NOT NULL,
  `appointment_date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `status` enum('pending','confirmed','cancelled') NOT NULL DEFAULT 'pending',
  `notes` text,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `appointments_tab`
--

INSERT INTO `appointments_tab` (`appointment_id`, `id`, `patient_id`, `doctor_id`, `appointment_date`, `start_time`, `end_time`, `status`, `notes`, `created_at`, `updated_at`) VALUES
('', 1, '809544da-0139-424a-9e19-95c1b7316003', 'ce77c966-8681-43d9-bdcc-3ddda385f461', '2025-07-02', '13:39:00', '14:09:00', 'pending', 'Note 0', '2025-07-02 13:39:17', '2025-07-02 13:44:17'),
('', 2, 'a2bd05f6-9777-4fdf-b8b6-88d9d7835540', '52730aa3-f30b-44c9-88cf-96089961e50c', '2025-06-10', '01:21:00', '01:51:00', 'pending', 'Note 1', '2025-06-10 01:21:42', '2025-06-10 01:26:42'),
('', 3, '2965955e-89de-41ef-859c-c458b47734da', 'eb360da7-4da4-4e26-a133-3bee45630ac1', '2025-07-27', '13:38:00', '14:08:00', 'confirmed', 'Note 2', '2025-07-27 13:38:27', '2025-07-27 13:43:27'),
('', 4, '05690962-637a-4be1-b637-cb21aad30ebd', 'd04a4655-6ae1-44f8-9bf1-e3a80757bdb6', '2025-06-23', '01:01:00', '01:31:00', 'pending', 'Note 3', '2025-06-23 01:01:28', '2025-06-23 01:06:28'),
('', 5, '3383944c-b821-4253-a6d6-282dc4fed8e0', '8a61b88d-bf23-4d7e-a7fb-fa41a1674005', '2025-06-13', '13:25:00', '13:55:00', 'cancelled', 'Note 4', '2025-06-13 13:25:49', '2025-06-13 13:30:49'),
('', 6, 'caf802fe-c119-49d7-b890-018913f3d626', 'b8aa13a5-9499-46bf-a86d-92ed2019a3c7', '2025-07-19', '20:43:00', '21:13:00', 'confirmed', 'Note 5', '2025-07-19 20:43:31', '2025-07-19 20:48:31'),
('', 7, '60279e70-5fcf-424e-8228-62632b72ff41', '1b464afd-2695-4975-9b79-bd508b41f292', '2025-06-23', '16:48:00', '17:18:00', 'cancelled', 'Note 6', '2025-06-23 16:48:30', '2025-06-23 16:53:30'),
('', 8, '74db5cde-54f5-499c-ad7a-9a7f66c5e094', '733266be-1133-4785-a24c-6023042b1cc0', '2025-06-13', '22:57:00', '23:27:00', 'cancelled', 'Note 7', '2025-06-13 22:57:05', '2025-06-13 23:02:05'),
('', 9, '371f435c-cccb-4c71-820a-964e99981b21', '568c09b6-6cdf-40f4-97b1-f23adc0568cd', '2025-07-26', '20:57:00', '21:27:00', 'confirmed', 'Note 8', '2025-07-26 20:57:19', '2025-07-26 21:02:19'),
('', 10, '0db0dacc-361e-41c5-b497-459d48229d7a', '679d2340-079c-4b00-b7d4-5e2a46400a28', '2025-06-17', '12:30:00', '13:00:00', 'cancelled', 'Note 9', '2025-06-17 12:30:38', '2025-06-17 12:35:38'),
('', 11, '351fb075-e3a9-42f6-ac46-7ed82847b0f9', 'd15a6d9e-9f65-48ad-8197-d2f60d3f4dd9', '2025-06-06', '12:24:00', '12:54:00', 'cancelled', 'Note 10', '2025-06-06 12:24:30', '2025-06-06 12:29:30'),
('', 12, '9ab5e94f-2c4c-4985-b0b1-5d185fd4c82e', 'b30eeb8b-68e3-454c-9703-c634a5638b41', '2025-06-27', '21:46:00', '22:16:00', 'confirmed', 'Note 11', '2025-06-27 21:46:42', '2025-06-27 21:51:42'),
('', 13, '5feac8f2-db13-48e2-ac2a-34d738367528', '663c4895-5bb5-459d-9708-d949a6066b73', '2025-06-10', '18:36:00', '19:06:00', 'pending', 'Note 12', '2025-06-10 18:36:04', '2025-06-10 18:41:04'),
('', 14, 'e5fa0fd9-e5d3-4e30-87c0-ecc51c601a5d', 'bcee3985-93ec-4776-8076-c0f7fb62aa2e', '2025-06-21', '23:42:00', '00:12:00', 'pending', 'Note 13', '2025-06-21 23:42:31', '2025-06-21 23:47:31'),
('', 15, '3b01139b-7b0b-4b96-934e-69c9b0ceedc1', 'da2c9ea9-2070-4405-b57d-4e4d3a22399b', '2025-06-09', '10:08:00', '10:38:00', 'confirmed', 'Note 14', '2025-06-09 10:08:36', '2025-06-09 10:13:36'),
('', 16, 'b79399d1-f039-43a4-9331-224eb49a5ac3', 'efa95661-f0a1-4e73-8f46-04a1dd496b6e', '2025-07-03', '04:06:00', '04:36:00', 'cancelled', 'Note 15', '2025-07-03 04:06:55', '2025-07-03 04:11:55'),
('', 17, 'acc34bab-2c57-4866-b722-37297a338a94', '612bc135-bfba-4b76-9402-9d5083f77a33', '2025-07-14', '12:12:00', '12:42:00', 'pending', 'Note 16', '2025-07-14 12:12:46', '2025-07-14 12:17:46'),
('', 18, 'e17c5cce-78f8-4ad1-9fe6-ec9cd64581db', '42654f0a-78de-4d98-9755-1e3e518d1193', '2025-07-15', '06:29:00', '06:59:00', 'cancelled', 'Note 17', '2025-07-15 06:29:49', '2025-07-15 06:34:49'),
('', 19, 'f1d334a0-a5e4-4152-8819-fbfcfd37ea67', '16f82c97-72e1-4ed8-af45-fbf144d10d97', '2025-07-04', '13:53:00', '14:23:00', 'confirmed', 'Note 18', '2025-07-04 13:53:53', '2025-07-04 13:58:53'),
('', 20, '39ab6400-93e3-492f-be56-9cd927217b95', 'd15ef05a-c43a-4779-9c7c-9cba21687f9e', '2025-06-22', '16:57:00', '17:27:00', 'pending', 'Note 19', '2025-06-22 16:57:43', '2025-06-22 17:02:43'),
('197165c9-b989-45d1-9875-11fcf5318e1a', 21, '289e01de-2cb7-4082-bc63-ca6207c7acca', '804de7d8-6dfe-4293-a2eb-b76741b78fb8', '2025-12-31', '18:03:00', '06:09:00', 'pending', 'dolor', '2025-07-02 06:24:59', '2025-01-29 06:09:39'),
('197165c9-b989-45d1-9875-11fcf5318e1b', 22, '289e01de-2cb7-4082-bc63-ca6207c7acca', '804de7d8-6dfe-4293-a2eb-b76741b78fb8', '2025-12-31', '18:03:00', '06:09:00', 'pending', 'dolor', '2025-07-02 06:24:59', '2025-01-29 06:09:39'),
('197165c9-b989-45d1-9875-11fcf5318e1c', 23, '289e01de-2cb7-4082-bc63-ca6207c7acca', '804de7d8-6dfe-4293-a2eb-b76741b78fb8', '2025-12-31', '18:03:00', '06:09:00', 'pending', 'dolor', '2025-07-02 06:24:59', '2025-01-29 06:09:39'),
('197165c9-b989-45d1-9875-11fcf5318e1d', 24, '289e01de-2cb7-4082-bc63-ca6207c7accb', '804de7d8-6dfe-4293-a2eb-b76741b78fb8', '2025-12-31', '18:03:00', '06:09:00', 'pending', 'dolor', '2025-07-02 06:24:59', '2025-01-29 06:09:39'),
('197165c9-b989-45d1-9875-11fcf5318e1e', 25, '289e01de-2cb7-4082-bc63-ca6207c7accc', '804de7d8-6dfe-4293-a2eb-b76741b78fb8', '2025-12-31', '18:03:00', '06:09:00', 'pending', 'dolor', '2025-07-02 06:24:59', '2025-01-29 06:09:39'),
('11111111-1111-1111-1111-111111111111', 26, 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'doc-1234-doc-1234-doc-1234-doc1234', '2025-07-05', '10:00:00', '10:30:00', 'pending', 'Initial consult', '2025-07-02 21:41:16', '2025-07-02 21:41:16'),
('22222222-2222-2222-2222-222222222222', 27, 'bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'doc-1234-doc-1234-doc-1234-doc1234', '2025-07-05', '09:00:00', '09:30:00', 'confirmed', 'Follow-up', '2025-07-02 21:41:16', '2025-07-02 21:41:16'),
('33333333-3333-3333-3333-333333333333', 28, 'ccccccc3-cccc-cccc-cccc-cccccccccccc', 'doc-1234-doc-1234-doc-1234-doc1234', '2025-07-05', '10:00:00', '10:30:00', 'pending', 'Reschedule needed', '2025-07-02 21:41:16', '2025-07-02 21:41:16'),
('44444444-4444-4444-4444-444444444444', 29, 'ddddddd4-dddd-dddd-dddd-dddddddddddd', 'doc-1234-doc-1234-doc-1234-doc1234', '2025-07-05', '10:00:00', '10:30:00', 'pending', 'Late arrival', '2025-07-02 21:41:16', '2025-07-02 21:41:16'),
('ppt-uuid-0001-0001-0001-000000000001', 32, 'pat-uuid-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'doc-uuid-1111-1111-1111-111111111111', '2025-08-15', '10:00:00', '10:30:00', 'pending', 'Patient 1 booking', '2025-07-02 22:18:06', '2025-07-02 22:20:34'),
('ppt-uuid-0002-0002-0002-000000000002', 33, 'pat-uuid-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'doc-uuid-1111-1111-1111-111111111111', '2025-08-15', '10:00:00', '10:30:00', 'pending', 'Patient 2 booking', '2025-07-02 22:18:06', '2025-07-02 22:20:34'),
('ppt-uuid-0003-0003-0003-000000000003', 34, 'pat-uuid-cccc-cccc-cccc-cccccccccccc', 'doc-uuid-1111-1111-1111-111111111111', '2025-08-15', '10:00:00', '10:30:00', 'pending', 'Patient 2 booking', '2025-07-02 22:18:06', '2025-07-02 22:20:34'),
('809544da-0139-424a-9e19-95c1b7316003', 35, '809554da-0139-424a-9e19-95c1b7316003', 'ce77c966-8681-43d9-bdcc-3ddda385f461', '2025-02-08', '09:30:00', '10:00:00', 'pending', 'esse', '2025-07-02 13:39:17', '2025-07-02 13:39:17'),
('ppt-uuid-0004-0004-0004-000000000004', 36, 'pat-uuid-dddd-dddd-dddd-dddddddddddd', 'doc-uuid-1111-1111-1111-111111111112', '2025-08-15', '10:00:00', '10:30:00', 'pending', 'Patient 2 booking', NOW(), NOW());

-- --------------------------------------------------------

--
-- Table structure for table `prescription`
--

CREATE TABLE `prescription` (
  `id` int(11) NOT NULL,
  `prescription_id` char(36) DEFAULT NULL,
  `medical_record_id` varchar(255) DEFAULT NULL,
  `total_cost` double NOT NULL,
  `status` enum('PENDING','APPROVED','REJECTED','COMPLETED') NOT NULL,
  `is_paid` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `prescription`
--

INSERT INTO `prescription` (`id`, `prescription_id`, `medical_record_id`, `total_cost`, `status`, `is_paid`, `created_at`, `updated_at`, `is_deleted`) VALUES
(1, 'quis cupidatat et dolor', 'fugiat', -33170388.84279149, 'PENDING', 1, '2025-07-01 05:19:43', '2025-07-02 03:25:11', 0),
(2, 'ad id', 'deserunt elit consequat', -92173591.71449134, 'APPROVED', 1, '2025-07-01 21:50:22', '2025-07-04 08:33:03', 0),
(3, 'ad id', 'deserunt elit consequat', -92173591.71449134, 'APPROVED', 1, '2025-07-01 21:50:22', '2025-07-04 08:33:03', 0),
(4, '416e1a4f-0260-4141-83bd-2186312927c9', 'da8500cc-df0a-472d-8ae1-6500b5228107', 282.55, 'APPROVED', 0, '2025-06-09 19:22:28', '2025-06-09 19:52:28', 0),
(5, 'c3535256-301c-4860-80ef-2de917a0443e', '87105403-39b1-42ab-80e5-852455365dd7', 460.78, 'REJECTED', 0, '2025-06-18 20:01:44', '2025-06-18 20:31:44', 1),
(6, 'c7faa5fd-12bc-4475-acb5-993d5d83ea29', 'bd8ca69b-c7a4-4198-a262-cebeec95981c', 402.34, 'APPROVED', 0, '2025-07-24 05:32:23', '2025-07-24 06:02:23', 1),
(7, '7281c263-4515-4f4d-9714-98d019c4377c', '7257ff35-de4a-4761-a803-d1c8ef3e7436', 395.91, 'COMPLETED', 0, '2025-06-29 20:59:23', '2025-06-29 21:29:23', 1),
(8, 'ca45fdb3-3ccf-44bd-a26c-245c428b15fa', '88c97a5b-73d9-487b-af94-c11b75f880d7', 327.03, 'REJECTED', 0, '2025-06-16 18:23:19', '2025-06-16 18:53:19', 0),
(9, 'd4c3b6fb-e31b-4959-a88d-b8b8d77ed5ae', '66f543fd-6588-431e-a542-8899a0bbd2be', 190.32, 'APPROVED', 0, '2025-06-27 13:23:40', '2025-06-27 13:53:40', 1),
(10, 'a0d36066-f03b-4284-a4ec-279379678243', '2d861822-4732-4e83-b88a-ae877c02e83f', 454.67, 'COMPLETED', 0, '2025-06-05 06:28:49', '2025-06-05 06:58:49', 1),
(11, '98afe3ea-e629-4b23-903d-c45810e30aea', '5ca7b24c-f4e1-4da7-a3b3-98d684081cb6', 222.03, 'PENDING', 0, '2025-06-03 10:07:40', '2025-06-03 10:37:40', 1),
(12, '774a3b9b-9d1e-46a7-8292-6fb5cc671cde', '5c76cb70-0b96-4ad0-8c44-06aa1deaf3e4', 415.51, 'APPROVED', 0, '2025-07-30 19:51:48', '2025-07-30 20:21:48', 0),
(13, '33a79752-3b55-486a-9278-22ffc6551763', '0f924c87-aece-4c25-a9c2-c685f1f74eb1', 400.63, 'PENDING', 0, '2025-06-27 09:03:04', '2025-06-27 09:33:04', 0),
(14, '87b8779e-ce44-447b-a4cf-81eed92ea7ef', '8123ae1d-c7a5-4570-92c7-e36e19b47b2d', 475.19, 'REJECTED', 1, '2025-06-10 21:22:02', '2025-06-10 21:52:02', 0),
(15, 'ca20be25-bff7-4f53-8fbe-98f682e981ed', '256f9f01-f8e3-4dcb-891b-2df228593295', 368.32, 'COMPLETED', 0, '2025-07-30 02:06:54', '2025-07-30 02:36:54', 0),
(16, '27718f7f-bad2-4541-a0c8-a4ef31c4d0fa', 'a890ee59-d727-4df6-8042-40f056f6f74e', 449.83, 'PENDING', 0, '2025-06-12 02:11:56', '2025-06-12 02:41:56', 0),
(17, '40b2d2c8-0dd6-44e9-a7dd-79c7fe646880', '2f8fa77e-c713-4750-a626-397155673962', 147.31, 'COMPLETED', 1, '2025-06-07 05:57:51', '2025-06-07 06:27:51', 0),
(18, '82252325-24d2-429e-a702-6218600da15a', 'd099547e-b3bb-4ecc-b040-ab1969f40670', 106.04, 'PENDING', 0, '2025-07-02 05:25:16', '2025-07-02 05:55:16', 0),
(19, '7a1c1860-76f3-47d3-9d15-fd671946f3a7', '38a04913-2cdd-464e-8bcf-faef035f3736', 77.42, 'PENDING', 0, '2025-07-19 12:52:06', '2025-07-19 13:22:06', 0),
(20, '37493d2f-4bde-4437-a66e-b537aeeb3ccb', '98f38e6b-02c7-4a1b-b305-c357d762092c', 195.3, 'COMPLETED', 0, '2025-07-28 12:17:17', '2025-07-28 12:47:17', 1),
(21, 'daed3bd4-0a59-4491-a636-074d22a2799b', '758510ff-7080-4f6e-b31b-a1959902c354', 303.2, 'COMPLETED', 1, '2025-07-14 03:20:48', '2025-07-14 03:50:48', 0),
(22, 'e3548c72-7749-4332-a302-2c808432ec0e', 'd9057b40-93c1-4994-a6a7-32f8bb1fc540', 346.35, 'REJECTED', 1, '2025-06-09 11:18:41', '2025-06-09 11:48:41', 1),
(23, 'a3f44a82-19be-415b-8c79-200cfa8a3977', '70ad7fb9-f289-4508-9440-48ddd4fd6571', 458.66, 'PENDING', 1, '2025-06-27 19:07:58', '2025-06-27 19:37:58', 0),
(24, 'ad id', 'deserunt elit consequat', -92173591.71449134, 'APPROVED', 1, '2025-07-01 21:50:22', '2025-07-04 08:33:03', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `appointments_tab`
--
ALTER TABLE `appointments_tab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `prescription`
--
ALTER TABLE `prescription`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `appointments_tab`
--
ALTER TABLE `appointments_tab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `prescription`
--
ALTER TABLE `prescription`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
