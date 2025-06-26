<?php
header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);

$student_ID = $data['student_ID'] ?? '';
$subject_ID = $data['subject_ID'] ?? '';

if (!$student_ID || !$subject_ID) {
    echo json_encode(['success' => false, 'message' => 'Missing student or subject ID']);
    exit;
}

$conn = new mysqli('localhost', 'root', '', 'laboratory_booking_system');
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'DB connection failed']);
    exit;
}

$stmt = $conn->prepare("DELETE FROM enroll_course WHERE student_ID = ? AND subject_ID = ?");
$stmt->bind_param('ss', $student_ID, $subject_ID);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => $conn->error]);
}

$stmt->close();
$conn->close();
