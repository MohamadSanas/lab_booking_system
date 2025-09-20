<?php
session_start();
header('Content-Type: application/json');

$conn = new mysqli("localhost", "root", "", "laboratory_booking_system");
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'DB connection failed.']);
    exit;
}

$student_ID = $_SESSION['user_id'] ?? '';
if (empty($student_ID)) {
    echo json_encode(['success' => false, 'message' => 'Student not logged in.']);
    exit;
}

$sql = "SELECT subject_ID, subject_name FROM enroll_course WHERE student_ID = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $student_ID);
$stmt->execute();
$result = $stmt->get_result();

$courses = [];
while ($row = $result->fetch_assoc()) {
    $courses[] = $row;
}

echo json_encode(['success' => true, 'courses' => $courses]);
$conn->close();
?>
