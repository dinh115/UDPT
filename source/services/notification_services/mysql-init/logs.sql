-- phpMyAdmin SQL Dump
-- version 4.9.5
-- https://www.phpmyadmin.net/
--
-- Host: mysql-notification:3306
-- Generation Time: Jul 04, 2025 at 02:01 AM
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
-- Database: `logs`
--

-- --------------------------------------------------------

--
-- Table structure for table `email_logs`
--

CREATE TABLE `email_logs` (
  `id` int(11) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `type` enum('reminder','prescription') DEFAULT NULL,
  `status` enum('success','failed') DEFAULT NULL,
  `message` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `email_logs`
--

INSERT INTO `email_logs` (`id`, `email`, `type`, `status`, `message`, `created_at`) VALUES
(1, 'nguyendinhphuongdai@gmail.com', 'reminder', 'success', 'Email sent', '2025-07-01 13:17:59'),
(2, 'nguyendinhphuongdai@gmail.com', 'prescription', 'success', 'Email sent', '2025-07-01 13:18:51'),
(3, 'nguyendinhphuongdai@gmail.com', 'reminder', 'success', 'Email sent', '2025-07-01 13:26:24'),
(4, 'nguyendinhphuongdai@gmail.com', 'prescription', 'success', 'Email sent', '2025-07-01 13:26:43'),
(5, 'nguyendinhphuongdai@gmail.com', 'reminder', 'success', 'Email sent', '2025-07-01 13:30:59'),
(6, 'nguyendinhphuongdai@gmail.com', 'prescription', 'success', 'Email sent', '2025-07-01 13:31:02'),
(7, 'nguyendinhphuongdai@gmail.com', 'reminder', 'success', 'Email sent', '2025-07-03 15:42:20'),
(8, 'nguyendinhphuongdai@gmail.com', 'prescription', 'success', 'Email sent', '2025-07-03 15:42:30');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `email_logs`
--
ALTER TABLE `email_logs`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `email_logs`
--
ALTER TABLE `email_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
