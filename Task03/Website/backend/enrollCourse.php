<?php
header('Content-Type: application/json');
require 'db.php';

$data = json_decode(file_get_contents('php://input'), true);

$student_ID = $data['student_ID'] ?? '';
$subject_ID = $data['subject_ID'] ?? '';
$subject_name = $data['subject_name'] ?? '';
$credit = $data['credit'] ?? '';
$hours = $data['hours'] ?? '';

if (!$student_ID || !$subject_ID || !$subject_name) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

// Check if already enrolled
$stmt = $conn->prepare("SELECT * FROM enrollments WHERE student_ID = ? AND subject_ID = ?");
$stmt->bind_param("ss", $student_ID, $subject_ID);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'Already enrolled']);
    $stmt->close();
    $conn->close();
    exit;
}
$stmt->close();

// Insert enrollment
$stmt = $conn->prepare("INSERT INTO enrollments (student_ID, subject_ID, subject_name, credit, hours) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("sssss", $student_ID, $subject_ID, $subject_name, $credit, $hours);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Enrollment failed']);
}

$stmt->close();
$conn->close();
