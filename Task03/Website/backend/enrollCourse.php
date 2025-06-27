<?php
// backend/enrollCourse.php
session_start(); // Ensure session is started to get student ID

header('Content-Type: application/json');



$student_ID = $_SESSION['userID'] ?? '';
$student_role= $_SESSION['role'] ?? '';



if (!isset($_POST['course_code']) || empty($_POST['course_code'])) {
    echo json_encode(['success' => false, 'message' => 'Course code is required.']);
    exit;
}

$course_code = trim($_POST['course_code']);

$conn = new mysqli("localhost", "root", "", "laboratory_booking_system");

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'DB connection failed.']);
    exit;
}

// Fetch course info
$stmt = $conn->prepare("SELECT name FROM subjects WHERE course_code = ?");
$stmt->bind_param("s", $course_code);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Course not found.']);
    exit;
}

$stmt->bind_result($course_name);
$stmt->fetch();
$stmt->close();

// Insert into enroll_course
$insert = $conn->prepare("INSERT INTO enroll_course (student_ID, subject_ID, subject_name) VALUES (?, ?, ?)");
$insert->bind_param("sss", $student_ID, $course_code, $course_name);

if ($insert->execute()) {
    echo json_encode(['success' => true, 'message' => 'Course enrolled successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Enrollment failed or already enrolled.']);
}

$insert->close();
$conn->close();
