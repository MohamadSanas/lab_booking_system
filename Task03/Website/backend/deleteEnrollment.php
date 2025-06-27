<?php
// backend/deleteEnrollment.php
session_start();

header('Content-Type: application/json');

$student_ID = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : 'san099';

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

$stmt = $conn->prepare("DELETE FROM enroll_course WHERE student_ID = ? AND subject_ID = ?");
$stmt->bind_param("ss", $student_ID, $course_code);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Enrollment removed.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to remove enrollment.']);
}

$stmt->close();
$conn->close();
