<?php
header('Content-Type: application/json');
require 'db.php';

$data = json_decode(file_get_contents('php://input'), true);

$student_ID = $data['student_ID'] ?? '';
$subject_ID = $data['subject_ID'] ?? '';

if (!$student_ID || !$subject_ID) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

$stmt = $conn->prepare("DELETE FROM enrollments WHERE student_ID = ? AND subject_ID = ?");
$stmt->bind_param("ss", $student_ID, $subject_ID);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Deletion failed']);
}

$stmt->close();
$conn->close();
