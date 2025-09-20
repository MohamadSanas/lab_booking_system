<?php
// backend/getCourseInfo_for_std.php

header('Content-Type: application/json');

if (!isset($_POST['course_code']) || empty($_POST['course_code'])) {
    echo json_encode(['success' => false, 'message' => 'Course code is required.']);
    exit;
}

$courseCode = trim($_POST['course_code']);

$conn = new mysqli("localhost", "root", "", "laboratory_booking_system");

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed.']);
    exit;
}

// Use the correct table: subjects
$stmt = $conn->prepare("SELECT name, credit FROM subjects WHERE course_code = ?");
$stmt->bind_param("s", $courseCode);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Course not found.']);
    exit;
}

$stmt->bind_result($name, $credit);
$stmt->fetch();

$hours = $credit * 15;

echo json_encode([
    'success' => true,
    'name' => $name,
    'credits' => $credit,
    'hours' => $hours
]);

$stmt->close();
$conn->close();
