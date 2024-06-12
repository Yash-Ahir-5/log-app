-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jun 12, 2024 at 11:39 AM
-- Server version: 8.2.0
-- PHP Version: 8.2.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `vendordata`
--

-- --------------------------------------------------------

--
-- Table structure for table `filestatus`
--

DROP TABLE IF EXISTS `filestatus`;
CREATE TABLE IF NOT EXISTS `filestatus` (
  `id` int NOT NULL AUTO_INCREMENT,
  `rowsInserted` int NOT NULL,
  `rowsUpdated` int NOT NULL,
  `rowsSkipped` int NOT NULL,
  `vendorName` varchar(50) NOT NULL,
  `status` enum('onProgress','Success','Failed') NOT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `filestatus`
--

INSERT INTO `filestatus` (`id`, `rowsInserted`, `rowsUpdated`, `rowsSkipped`, `vendorName`, `status`, `time`) VALUES
(1, 5, 0, 0, 'Demo', 'Success', '2024-06-12 10:27:49'),
(2, 0, 0, 5, 'Demo', 'Success', '2024-06-12 10:28:09'),
(3, 0, 1, 4, 'Demo', 'Success', '2024-06-12 10:29:18'),
(4, 85, 15, 0, 'Hardik Prajapati', 'Success', '2024-06-12 10:31:05');

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
CREATE TABLE IF NOT EXISTS `product` (
  `id` int NOT NULL AUTO_INCREMENT,
  `productName` varchar(255) NOT NULL,
  `price` int NOT NULL,
  `quantity` int NOT NULL,
  `vendorName` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=91 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`id`, `productName`, `price`, `quantity`, `vendorName`) VALUES
(1, 'Dahi Puri', 56, 50, 'Demo'),
(2, 'Pav Bhaji', 66, 45, 'Demo'),
(3, 'Misal Pav', 76, 45, 'Demo'),
(4, 'Vada', 86, 35, 'Demo'),
(5, 'Bhature', 96, 25, 'Demo'),
(6, 'Poha', 16, 50, 'Hardik Prajapati'),
(7, 'Misal Pav', 56, 40, 'Hardik Prajapati'),
(8, 'Pav Bhaji', 50, 50, 'Hardik Prajapati'),
(9, 'Paneer Tikka', 90, 35, 'Hardik Prajapati'),
(10, 'Tandoori Chicken', 200, 30, 'Hardik Prajapati'),
(11, 'Butter Chicken', 180, 25, 'Hardik Prajapati'),
(12, 'Rogan Josh', 130, 20, 'Hardik Prajapati'),
(13, 'Biryani', 100, 15, 'Hardik Prajapati'),
(14, 'Palak Paneer', 100, 150, 'Hardik Prajapati'),
(15, 'Chole Bhature', 70, 20, 'Hardik Prajapati'),
(16, 'Rajma Chawal', 80, 25, 'Hardik Prajapati'),
(17, 'Aloo Paratha', 36, 190, 'Hardik Prajapati'),
(18, 'Methi Thepla', 40, 35, 'Hardik Prajapati'),
(19, 'Dahi Vada', 60, 40, 'Hardik Prajapati'),
(20, 'Aloo Chaat', 46, 45, 'Hardik Prajapati'),
(21, 'Masala Dosa', 56, 55, 'Hardik Prajapati'),
(22, 'Chicken Biryani', 200, 20, 'Hardik Prajapati'),
(23, 'Mutton Curry', 250, 65, 'Hardik Prajapati'),
(24, 'Fish Fry', 150, 70, 'Hardik Prajapati'),
(25, 'Prawn Curry', 220, 75, 'Hardik Prajapati'),
(26, 'Veg Pulao', 100, 25, 'Hardik Prajapati'),
(27, 'Chicken Curry', 160, 60, 'Hardik Prajapati'),
(28, 'Paneer Butter Masala', 130, 90, 'Hardik Prajapati'),
(29, 'Palak Chicken', 190, 95, 'Hardik Prajapati'),
(30, 'Egg Curry', 80, 80, 'Hardik Prajapati'),
(31, 'Matar Paneer', 90, 215, 'Hardik Prajapati'),
(32, 'Chicken Tikka', 180, 110, 'Hardik Prajapati'),
(33, 'Tandoori Roti', 20, 170, 'Hardik Prajapati'),
(34, 'Naan', 30, 130, 'Hardik Prajapati'),
(35, 'Garlic Naan', 36, 140, 'Hardik Prajapati'),
(36, 'Kulcha', 26, 150, 'Hardik Prajapati'),
(37, 'Lachha Paratha', 40, 160, 'Hardik Prajapati'),
(38, 'Butter Naan', 30, 180, 'Hardik Prajapati'),
(39, 'Plain Rice', 16, 200, 'Hardik Prajapati'),
(40, 'Jeera Rice', 26, 190, 'Hardik Prajapati'),
(41, 'Vegetable Pulao', 46, 180, 'Hardik Prajapati'),
(42, 'Biryani Rice', 56, 170, 'Hardik Prajapati'),
(43, 'Saffron Rice', 70, 160, 'Hardik Prajapati'),
(44, 'Lemon Rice', 40, 30, 'Hardik Prajapati'),
(45, 'Curd Rice', 30, 20, 'Hardik Prajapati'),
(46, 'Coconut Rice', 36, 130, 'Hardik Prajapati'),
(47, 'Tomato Rice', 50, 5, 'Hardik Prajapati'),
(48, 'Spinach Rice', 40, 110, 'Hardik Prajapati'),
(49, 'Peas Pulao', 50, 100, 'Hardik Prajapati'),
(50, 'Tamarind Rice', 56, 90, 'Hardik Prajapati'),
(51, 'Mushroom Pulao', 60, 80, 'Hardik Prajapati'),
(52, 'Fried Rice', 66, 70, 'Hardik Prajapati'),
(53, 'Masala Khichdi', 46, 60, 'Hardik Prajapati'),
(54, 'Pongal', 36, 50, 'Hardik Prajapati'),
(55, 'Bisibele Bath', 56, 40, 'Hardik Prajapati'),
(56, 'Vangi Bath', 46, 10, 'Hardik Prajapati'),
(57, 'Pepper Rice', 56, 8, 'Hardik Prajapati'),
(58, 'Paneer Pulao', 70, 12, 'Hardik Prajapati'),
(59, 'Capsicum Rice', 60, 15, 'Hardik Prajapati'),
(60, 'Mutton Biryani', 250, 30, 'Hardik Prajapati'),
(61, 'Egg Biryani', 150, 35, 'Hardik Prajapati'),
(62, 'Fish Biryani', 190, 40, 'Hardik Prajapati'),
(63, 'Prawn Biryani', 180, 45, 'Hardik Prajapati'),
(64, 'Hyderabadi Biryani', 300, 50, 'Hardik Prajapati'),
(65, 'Dum Biryani', 200, 55, 'Hardik Prajapati'),
(66, 'Fish Curry', 190, 70, 'Hardik Prajapati'),
(67, 'Chicken Masala', 180, 85, 'Hardik Prajapati'),
(68, 'Mutton Masala', 270, 90, 'Hardik Prajapati'),
(69, 'Fish Masala', 210, 95, 'Hardik Prajapati'),
(70, 'Paneer Masala', 140, 100, 'Hardik Prajapati'),
(71, 'Aloo Gobi', 80, 105, 'Hardik Prajapati'),
(72, 'Bhindi Masala', 50, 110, 'Hardik Prajapati'),
(73, 'Baingan Bharta', 66, 195, 'Hardik Prajapati'),
(74, 'Rajma Masala', 60, 120, 'Hardik Prajapati'),
(75, 'Chole Masala', 56, 125, 'Hardik Prajapati'),
(76, 'Dal Fry', 40, 130, 'Hardik Prajapati'),
(77, 'Dal Tadka', 46, 135, 'Hardik Prajapati'),
(78, 'Dal Makhani', 50, 140, 'Hardik Prajapati'),
(79, 'Malai Kofta', 120, 145, 'Hardik Prajapati'),
(80, 'Shahi Paneer', 130, 155, 'Hardik Prajapati'),
(81, 'Kadai Paneer', 110, 160, 'Hardik Prajapati'),
(82, 'Butter Paneer', 140, 165, 'Hardik Prajapati'),
(83, 'Paneer Bhurji', 90, 170, 'Hardik Prajapati'),
(84, 'Veg Korma', 80, 175, 'Hardik Prajapati'),
(85, 'Veg Jalfrezi', 70, 180, 'Hardik Prajapati'),
(86, 'Aloo Palak', 50, 185, 'Hardik Prajapati'),
(87, 'Dum Aloo', 60, 190, 'Hardik Prajapati'),
(88, 'Veg Kurma', 56, 200, 'Hardik Prajapati'),
(89, 'Veg Handi', 70, 205, 'Hardik Prajapati'),
(90, 'Paneer Tikka Masala', 130, 210, 'Hardik Prajapati');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
