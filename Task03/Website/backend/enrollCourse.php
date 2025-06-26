<?php
header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);

$student_ID = $data['student_ID'] ?? '';
$subject_ID = $data['subject_ID'] ?? '';
$subject_name = $data['subject_name'] ?? '';
$credit = $data['credit'] ?? null;
$hours = $data['hours'] ?? null;

if (!$student_ID || !$subject_ID || !$subject_name) {
    echo json_encode(['success' => false, 'message' => 'Missing required data']);
    exit;
}

$conn = new mysqli('localhost', 'root', '', 'laboratory_booking_system');
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'DB connection failed']);
    exit;
}

// Check if already enrolled
$stmtCheck = $conn->prepare("SELECT * FROM enroll_course WHERE student_ID = ? AND subject_ID = ?");
$stmtCheck->bind_param('ss', $student_ID, $subject_ID);
$stmtCheck->execute();
$resultCheck = $stmtCheck->get_result();
if ($resultCheck->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'Already enrolled']);
    exit;
}

$stmtCheck->close();

// Insert enrollment
$stmt = $conn->prepare("INSERT INTO enroll_course (student_ID, subject_ID, subject_name, credit, hours) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param('sssis', $student_ID, $subject_ID, $subject_name, $credit, $hours);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => $conn->error]);
}

$stmt->close();
$conn->close();
