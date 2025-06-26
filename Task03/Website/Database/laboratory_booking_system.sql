-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 26, 2025 at 12:07 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `laboratory_booking_system`
--

-- --------------------------------------------------------

--
-- Table structure for table `instructors`
--

CREATE TABLE `instructors` (
  `ID` varchar(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `address` varchar(200) NOT NULL,
  `gender` enum('Male','Female','Other') DEFAULT NULL,
  `Dept_ID` varchar(20) NOT NULL,
  `phone_num` varchar(12) DEFAULT NULL,
  `personal_mail` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `instructors`
--

INSERT INTO `instructors` (`ID`, `name`, `address`, `gender`, `Dept_ID`, `phone_num`, `personal_mail`) VALUES
('I001', 'Helen Perera', '200 College Rd.', 'Female', 'CE', '0710003001', 'helen.perera@uni.edu'),
('I002', 'Ian Gomes', '210 College Rd.', 'Male', 'CE', '0710003002', 'ian.gomes@uni.edu'),
('I003', 'Jaya Fernando', '220 College Rd.', 'Male', 'CE', '0710003003', 'jaya.fernando@uni.edu'),
('I004', 'Kumari Jayasuriya', '230 College Rd.', 'Female', 'CE', '0710003004', 'kumari.j@uni.edu'),
('I005', 'Lalith Silva', '240 College Rd.', 'Male', 'CE', '0710003005', 'lalith.silva@uni.edu'),
('I006', 'Maya Rajapaksa', '250 College Rd.', 'Female', 'EEE', '0710003006', 'maya.raj@uni.edu'),
('I007', 'Nimal Bandara', '260 College Rd.', 'Male', 'EEE', '0710003007', 'nimal.bandara@uni.edu'),
('I008', 'Oshan Kularatne', '270 College Rd.', 'Male', 'EEE', '0710003008', 'oshan.k@uni.edu'),
('I009', 'Priya De Silva', '280 College Rd.', 'Female', 'EEE', '0710003009', 'priya.desilva@uni.edu'),
('I010', 'Rohan Wickramasinghe', '290 College Rd.', 'Male', 'EEE', '0710003010', 'rohan.w@uni.edu');

-- --------------------------------------------------------

--
-- Table structure for table `instruments_info`
--

CREATE TABLE `instruments_info` (
  `Instrument_code` varchar(20) NOT NULL,
  `Name` varchar(100) NOT NULL,
  `Quantity` int(11) NOT NULL,
  `Lab_code` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `laboratory`
--

CREATE TABLE `laboratory` (
  `Lab_code` varchar(10) NOT NULL,
  `Name` varchar(50) NOT NULL,
  `Dept_ID` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `laboratory`
--

INSERT INTO `laboratory` (`Lab_code`, `Name`, `Dept_ID`) VALUES
('COM01', 'Computer Lab 01', 'CE'),
('COM02', 'Computer Lab 02', 'CE'),
('COM03', 'Computer Lab 03', 'CE'),
('COM04', 'Computer Lab 04', 'CE'),
('COM05', 'Computer Lab 05', 'CE'),
('EEE01', 'Simulation Lab', 'EEE'),
('EEE02', 'Circuits Lab', 'EEE'),
('EEE03', 'Signals Lab', 'EEE'),
('EEE04', 'Systems Lab', 'EEE'),
('EEE05', 'Microcontrollers Lab', 'EEE');

-- --------------------------------------------------------

--
-- Table structure for table `lab_booking`
--

CREATE TABLE `lab_booking` (
  `subject_ID` varchar(6) NOT NULL,
  `practical_ID` varchar(10) NOT NULL,
  `lab_ID` varchar(10) NOT NULL,
  `instructor_ID` varchar(20) DEFAULT NULL,
  `schedule_date` date NOT NULL,
  `schedule_time` time NOT NULL,
  `action` enum('Finished','Poostponded','canceled') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `lecturers`
--

CREATE TABLE `lecturers` (
  `ID` varchar(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `address` varchar(200) NOT NULL,
  `gender` enum('Male','Female','Other') DEFAULT NULL,
  `Dept_ID` varchar(20) NOT NULL,
  `phone_num` varchar(12) DEFAULT NULL,
  `personal_mail` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `lecturers`
--

INSERT INTO `lecturers` (`ID`, `name`, `address`, `gender`, `Dept_ID`, `phone_num`, `personal_mail`) VALUES
('L001', 'Dr. Emma Lee', 'Female', '', 'CE', '0710002001', 'emma.lee@uni.edu'),
('L002', 'Dr. Frank Nede', 'Male', '', 'CE', '0710002002', 'frank.nede@uni.edu'),
('L003', 'Dr. Grace Yapa', 'Female', '', 'EEE', '0710002003', 'grace.yapa@uni.edu');

-- --------------------------------------------------------

--
-- Table structure for table `practical_assign_info`
--

CREATE TABLE `practical_assign_info` (
  `subject_ID` varchar(6) NOT NULL,
  `practical_ID` varchar(10) NOT NULL,
  `lab_ID` varchar(10) NOT NULL,
  `instructor_ID` varchar(20) DEFAULT NULL,
  `schedule_date` date NOT NULL,
  `schedule_time` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `practical_info`
--

CREATE TABLE `practical_info` (
  `Practical_ID` varchar(10) NOT NULL,
  `Name` varchar(50) NOT NULL,
  `Subject_ID` varchar(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `practical_info`
--

INSERT INTO `practical_info` (`Practical_ID`, `Name`, `Subject_ID`) VALUES
('PR001', 'File Handling', 'EC5080'),
('PR002', 'Regular Expressions', 'EC5080'),
('PR003', 'Concurrency', 'EC5080'),
('PR004', 'Simple Database', 'EC5070'),
('PR005', 'Course Registration Website', 'EC5070'),
('PR006', 'MySQL Operations', 'EC5070'),
('PR007', 'Logic Gate Simulation', 'EC5020');

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

CREATE TABLE `student` (
  `ID` varchar(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `address` varchar(200) NOT NULL,
  `gender` enum('Male','Female','Other') DEFAULT NULL,
  `Dept_ID` varchar(20) NOT NULL,
  `phone_num` varchar(12) DEFAULT NULL,
  `personal_mail` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student`
--

INSERT INTO `student` (`ID`, `name`, `address`, `gender`, `Dept_ID`, `phone_num`, `personal_mail`) VALUES
('S001', 'Bimal Fernando', '1 Flower St.', 'Male', 'CE', '710010001', 'user1@uni.edu'),
('S002', 'Chami Senaratne', '2 Flower St.', 'Female', 'CE', '710010002', 'user2@uni.edu'),
('S003', 'Dinesh Kumar', '3 Flower St.', 'Male', 'CE', '710010003', 'user3@uni.edu'),
('S004', 'Esha Perera', '4 Flower St.', 'Female', 'CE', '710010004', 'user4@uni.edu'),
('S005', 'Farhan Rauf', '5 Flower St.', 'Male', 'CE', '710010005', 'user5@uni.edu'),
('S006', 'Gayani Silva', '6 Flower St.', 'Female', 'CE', '710010006', 'user6@uni.edu'),
('S007', 'Harsha Abey', '7 Flower St.', 'Male', 'CE', '710010007', 'user7@uni.edu'),
('S008', 'Ishara Wick', '8 Flower St.', 'Female', 'CE', '710010008', 'user8@uni.edu'),
('S009', 'Jeevan Perera', '9 Flower St.', 'Male', 'CE', '710010009', 'user9@uni.edu'),
('S010', 'Kavindi Jayasuriya', '10 Flower St.', 'Female', 'CE', '710010010', 'user10@uni.edu'),
('S011', 'Lahiru Silva', '11 Flower St.', 'Male', 'CE', '710010011', 'user11@uni.edu'),
('S012', 'Madhuri Samarasinghe', '12 Flower St.', 'Female', 'CE', '710010012', 'user12@uni.edu'),
('S014', 'Oshan Ratnayake', '14 Flower St.', 'Female', 'CE', '710010014', 'user14@uni.edu'),
('S015', 'Priyanka De Silva', '15 Flower St.', 'Male', 'CE', '710010015', 'user15@uni.edu'),
('S016', 'Quinton Perera', '16 Flower St.', 'Female', 'CE', '710010016', 'user16@uni.edu'),
('S017', 'Rashmi Kumari', '17 Flower St.', 'Male', 'CE', '710010017', 'user17@uni.edu'),
('S018', 'Sanith Karunaratne', '18 Flower St.', 'Female', 'CE', '710010018', 'user18@uni.edu'),
('S019', 'Tharushi Warnakula', '19 Flower St.', 'Male', 'CE', '710010019', 'user19@uni.edu'),
('S020', 'Aria Jayawardene', '20 Flower St.', 'Female', 'EEE', '710010020', 'user20@uni.edu'),
('S021', 'Bimal Fernando', '21 Flower St.', 'Male', 'EEE', '710010021', 'user21@uni.edu'),
('S022', 'Chami Senaratne', '22 Flower St.', 'Female', 'EEE', '710010022', 'user22@uni.edu'),
('S023', 'Dinesh Kumar', '23 Flower St.', 'Male', 'EEE', '710010023', 'user23@uni.edu'),
('S024', 'Esha Perera', '24 Flower St.', 'Female', 'EEE', '710010024', 'user24@uni.edu'),
('S025', 'Farhan Rauf', '25 Flower St.', 'Male', 'EEE', '710010025', 'user25@uni.edu'),
('S026', 'Gayani Silva', '26 Flower St.', 'Female', 'EEE', '710010026', 'user26@uni.edu'),
('S027', 'Harsha Abey', '27 Flower St.', 'Male', 'EEE', '710010027', 'user27@uni.edu'),
('S028', 'Ishara Wick', '28 Flower St.', 'Female', 'EEE', '710010028', 'user28@uni.edu'),
('S029', 'Jeevan Perera', '29 Flower St.', 'Male', 'EEE', '710010029', 'user29@uni.edu'),
('S030', 'Kavindi Jayasuriya', '30 Flower St.', 'Female', 'EEE', '710010030', 'user30@uni.edu'),
('S031', 'Lahiru Silva', '31 Flower St.', 'Male', 'EEE', '710010031', 'user31@uni.edu'),
('S032', 'Madhuri Samarasinghe', '32 Flower St.', 'Female', 'EEE', '710010032', 'user32@uni.edu'),
('S033', 'Nadeesha Dias', '33 Flower St.', 'Male', 'EEE', '710010033', 'user33@uni.edu'),
('S034', 'Oshan Ratnayake', '34 Flower St.', 'Female', 'EEE', '710010034', 'user34@uni.edu'),
('S035', 'Priyanka De Silva', '35 Flower St.', 'Male', 'EEE', '710010035', 'user35@uni.edu'),
('S036', 'Quinton Perera', '36 Flower St.', 'Female', 'EEE', '710010036', 'user36@uni.edu'),
('S037', 'Rashmi Kumari', '37 Flower St.', 'Male', 'EEE', '710010037', 'user37@uni.edu'),
('S038', 'Sanith Karunaratne', '38 Flower St.', 'Female', 'EEE', '710010038', 'user38@uni.edu'),
('S039', 'Tharushi Warnakula', '39 Flower St.', 'Male', 'EEE', '710010039', 'user39@uni.edu'),
('S040', 'Aria Jayawardene', '40 Flower St.', 'Female', 'EEE', '710010040', 'user40@uni.edu'),
('S041', 'Bimal Fernando', '41 Flower St.', 'Male', 'EEE', '710010041', 'user41@uni.edu'),
('S042', 'Chami Senaratne', '42 Flower St.', 'Female', 'EEE', '710010042', 'user42@uni.edu'),
('S043', 'Dinesh Kumar', '43 Flower St.', 'Male', 'EEE', '710010043', 'user43@uni.edu'),
('S044', 'Esha Perera', '44 Flower St.', 'Female', 'EEE', '710010044', 'user44@uni.edu'),
('S045', 'Farhan Rauf', '45 Flower St.', 'Male', 'EEE', '710010045', 'user45@uni.edu'),
('S046', 'Gayani Silva', '46 Flower St.', 'Female', 'EEE', '710010046', 'user46@uni.edu'),
('S047', 'Harsha Abey', '47 Flower St.', 'Male', 'EEE', '710010047', 'user47@uni.edu'),
('S048', 'Ishara Wick', '48 Flower St.', 'Female', 'EEE', '710010048', 'user48@uni.edu'),
('S049', 'Jeevan Perera', '49 Flower St.', 'Male', 'EEE', '710010049', 'user49@uni.edu'),
('S050', 'Kavindi Jayasuriya', '50 Flower St.', 'Female', 'EEE', '710010050', 'user50@uni.edu'),
('san099', 'Mohamad Sanas', 'Sungavil Polonnaruwa', 'Male', 'CE', '713453246', 'san099@uni.edu');

-- --------------------------------------------------------

--
-- Table structure for table `subjects`
--

CREATE TABLE `subjects` (
  `course_code` varchar(6) NOT NULL,
  `name` varchar(50) NOT NULL,
  `credit` int(11) NOT NULL,
  `Dept_ID` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subjects`
--

INSERT INTO `subjects` (`course_code`, `name`, `credit`, `Dept_ID`) VALUES
('EC5020', 'Digital Design', 3, 'EEE'),
('EC5070', 'Database Management', 3, 'CE'),
('EC5080', 'Software Construction', 3, 'CE');

-- --------------------------------------------------------

--
-- Table structure for table `technical_officer`
--

CREATE TABLE `technical_officer` (
  `ID` varchar(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `address` varchar(200) NOT NULL,
  `gender` enum('Male','Female','Other') DEFAULT NULL,
  `Dept_ID` varchar(20) NOT NULL,
  `phone_num` varchar(12) DEFAULT NULL,
  `personal_mail` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `technical_officer`
--

INSERT INTO `technical_officer` (`ID`, `name`, `address`, `gender`, `Dept_ID`, `phone_num`, `personal_mail`) VALUES
('T001', 'Alice Moore', '12 Oak St.', 'Female', 'CE', '710001001', 'alice.moore@uni.edu'),
('T002', 'Bob Tan', '34 Pine Rd.', 'Male', 'CE', '710001002', 'bob.tan@uni.edu'),
('T003', 'Chitra Silva', '56 Maple Ave.', 'Female', 'EEE', '710001003', 'chitra.silva@uni.edu'),
('T004', 'David Perera', '78 Elm Blvd.', 'Male', 'EEE', '710001004', 'david.perera@uni.edu');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `ID` varchar(20) NOT NULL,
  `password` varchar(100) DEFAULT NULL,
  `role` enum('student','Technical_Officer','Lecturer','Instructor','Managment_Staff') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`ID`, `password`, `role`) VALUES
('I001', 'pass123ins01', 'Instructor'),
('I002', 'pass123ins02', 'Instructor'),
('I003', 'pass123ins03', 'Instructor'),
('I004', 'pass12304', 'Instructor'),
('I005', 'pass123ins05', 'Instructor'),
('I006', 'pass123ins06', 'Instructor'),
('I007', 'pass123ins07', 'Instructor'),
('I008', 'pass123ins08', 'Instructor'),
('I009', 'pass123ins09', 'Instructor'),
('I010', 'pass123ins10', 'Instructor'),
('L001', 'pass123lt01', 'Lecturer'),
('L002', 'pass123lt02', 'Lecturer'),
('L003', 'pass123lt03', 'Lecturer'),
('S001', 'pass126', 'student'),
('S002', 'pass127', 'student'),
('S003', 'pass128', 'student'),
('S004', 'pass129', 'student'),
('S005', 'pass130', 'student'),
('S006', 'pass131', 'student'),
('S007', 'pass132', 'student'),
('S008', 'pass133', 'student'),
('S009', 'pass134', 'student'),
('S010', 'pass135', 'student'),
('S011', 'pass136', 'student'),
('S012', 'pass137', 'student'),
('S013', 'pass138', 'student'),
('S014', 'pass139', 'student'),
('S015', 'pass140', 'student'),
('S016', 'pass141', 'student'),
('S017', 'pass142', 'student'),
('S018', 'pass143', 'student'),
('S019', 'pass144', 'student'),
('S020', 'pass145', 'student'),
('S021', 'pass146', 'student'),
('S022', 'pass147', 'student'),
('S023', 'pass148', 'student'),
('S024', 'pass149', 'student'),
('S025', 'pass150', 'student'),
('S026', 'pass151', 'student'),
('S027', 'pass152', 'student'),
('S028', 'pass153', 'student'),
('S029', 'pass154', 'student'),
('S030', 'pass155', 'student'),
('S031', 'pass156', 'student'),
('S032', 'pass157', 'student'),
('S033', 'pass158', 'student'),
('S034', 'pass159', 'student'),
('S035', 'pass160', 'student'),
('S036', 'pass161', 'student'),
('S037', 'pass162', 'student'),
('S038', 'pass163', 'student'),
('S039', 'pass164', 'student'),
('S040', 'pass165', 'student'),
('S041', 'pass166', 'student'),
('S042', 'pass167', 'student'),
('S043', 'pass168', 'student'),
('S044', 'pass169', 'student'),
('S045', 'pass170', 'student'),
('S046', 'pass171', 'student'),
('S047', 'pass172', 'student'),
('S048', 'pass173', 'student'),
('S049', 'pass174', 'student'),
('S050', 'pass175', 'student'),
('san099', 'San@12', 'student'),
('T001', 'pass123t01', 'Technical_Officer'),
('T002', 'pass123to2', 'Technical_Officer'),
('T003', 'pass123to3', 'Technical_Officer'),
('T004', 'pass123to4', 'Technical_Officer');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `instructors`
--
ALTER TABLE `instructors`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `Dept_ID` (`Dept_ID`);

--
-- Indexes for table `instruments_info`
--
ALTER TABLE `instruments_info`
  ADD PRIMARY KEY (`Instrument_code`),
  ADD KEY `Lab_code` (`Lab_code`);

--
-- Indexes for table `laboratory`
--
ALTER TABLE `laboratory`
  ADD PRIMARY KEY (`Lab_code`),
  ADD KEY `Dept_ID` (`Dept_ID`);

--
-- Indexes for table `lab_booking`
--
ALTER TABLE `lab_booking`
  ADD PRIMARY KEY (`subject_ID`,`practical_ID`),
  ADD KEY `lab_ID` (`lab_ID`),
  ADD KEY `practical_ID` (`practical_ID`),
  ADD KEY `instructor_ID` (`instructor_ID`);

--
-- Indexes for table `lecturers`
--
ALTER TABLE `lecturers`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `Dept_ID` (`Dept_ID`);

--
-- Indexes for table `practical_assign_info`
--
ALTER TABLE `practical_assign_info`
  ADD PRIMARY KEY (`subject_ID`,`practical_ID`),
  ADD KEY `lab_ID` (`lab_ID`),
  ADD KEY `practical_ID` (`practical_ID`),
  ADD KEY `instructor_ID` (`instructor_ID`);

--
-- Indexes for table `practical_info`
--
ALTER TABLE `practical_info`
  ADD PRIMARY KEY (`Practical_ID`),
  ADD KEY `Subject_ID` (`Subject_ID`);

--
-- Indexes for table `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `Dept_ID` (`Dept_ID`);

--
-- Indexes for table `subjects`
--
ALTER TABLE `subjects`
  ADD PRIMARY KEY (`course_code`),
  ADD KEY `Dept_ID` (`Dept_ID`);

--
-- Indexes for table `technical_officer`
--
ALTER TABLE `technical_officer`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `Dept_ID` (`Dept_ID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`ID`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `instruments_info`
--
ALTER TABLE `instruments_info`
  ADD CONSTRAINT `instruments_info_ibfk_1` FOREIGN KEY (`Lab_code`) REFERENCES `laboratory` (`Lab_code`);

--
-- Constraints for table `lab_booking`
--
ALTER TABLE `lab_booking`
  ADD CONSTRAINT `lab_booking_ibfk_1` FOREIGN KEY (`subject_ID`) REFERENCES `subjects` (`course_code`),
  ADD CONSTRAINT `lab_booking_ibfk_2` FOREIGN KEY (`lab_ID`) REFERENCES `laboratory` (`Lab_code`),
  ADD CONSTRAINT `lab_booking_ibfk_3` FOREIGN KEY (`practical_ID`) REFERENCES `practical_info` (`Practical_ID`),
  ADD CONSTRAINT `lab_booking_ibfk_4` FOREIGN KEY (`instructor_ID`) REFERENCES `instructors` (`ID`);

--
-- Constraints for table `practical_assign_info`
--
ALTER TABLE `practical_assign_info`
  ADD CONSTRAINT `practical_assign_info_ibfk_1` FOREIGN KEY (`subject_ID`) REFERENCES `subjects` (`course_code`),
  ADD CONSTRAINT `practical_assign_info_ibfk_2` FOREIGN KEY (`lab_ID`) REFERENCES `laboratory` (`Lab_code`),
  ADD CONSTRAINT `practical_assign_info_ibfk_3` FOREIGN KEY (`practical_ID`) REFERENCES `practical_info` (`Practical_ID`),
  ADD CONSTRAINT `practical_assign_info_ibfk_4` FOREIGN KEY (`instructor_ID`) REFERENCES `instructors` (`ID`);

--
-- Constraints for table `practical_info`
--
ALTER TABLE `practical_info`
  ADD CONSTRAINT `practical_info_ibfk_1` FOREIGN KEY (`Subject_ID`) REFERENCES `subjects` (`course_code`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
