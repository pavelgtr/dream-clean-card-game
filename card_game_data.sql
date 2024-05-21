-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: May 21, 2024 at 07:32 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `card_game_data`
--

-- --------------------------------------------------------

--
-- Table structure for table `game_data`
--

CREATE TABLE `game_data` (
  `id` int(11) NOT NULL,
  `nickname` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `score` int(11) NOT NULL,
  `game_level` int(11) NOT NULL,
  `total_time` float NOT NULL,
  `date_recorded` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `game_data`
--

INSERT INTO `game_data` (`id`, `nickname`, `email`, `score`, `game_level`, `total_time`, `date_recorded`) VALUES
(1, 'Julia Marte', 'juliamarte@gmail', 180, 3, 0, '2024-05-10 16:42:29'),
(3, 'Jose Perez', 'defdwg@gmail.com', 100, 3, 0, '2024-05-10 20:29:07'),
(5, 'luisa Rivas', 'fdfdgds@gmail.com', 150, 2, 9, '2024-05-13 15:11:11'),
(7, 'Maria Pina', 'toimas@gmail.com', 40, 2, 5, '2024-05-13 15:22:52'),
(17, 'angelica', 'angel@gmia', 11, 2, 4, '2024-05-14 12:29:14'),
(54, 'myNameAgain', 'tu@gmail.com', 480, 2, 0, '2024-05-19 07:39:21'),
(55, 'pavel', 'twintapes@gmail.com', 488, 2, 0, '2024-05-20 08:51:33'),
(57, 'pavel', 'amy.som@gmail.com', 547, 2, 0, '2024-05-20 18:04:25'),
(59, 'rogelio', 'rogelio@gmail.com', 1650, 2, 0, '2024-05-21 09:03:18'),
(61, 'mr Myagi', 'mr@gmail.com', 545, 2, 0, '2024-05-21 10:27:25');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `game_data`
--
ALTER TABLE `game_data`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `game_data`
--
ALTER TABLE `game_data`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=62;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
