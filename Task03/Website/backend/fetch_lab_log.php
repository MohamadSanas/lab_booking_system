<?php
session_start();
header('Content-Type: application/json');

// 1. Check if logged in
if (!isset($_SESSION['userID']) || $_SESSION['role'] !== 'Technical_Officer') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

$to_id = $_SESSION['userID'];

// 2. DB connection
$conn = new mysqli("localhost", "root", "", "laboratory_booking_system");
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

// 3. Get all lab logs only for the labs assigned to the Technical Officer
$sql = "
SELECT 
    pai.subject_ID,
    pai.practical_ID,
    pai.lab_ID,
    pai.instructor_ID,
    pai.schedule_date,
    pai.schedule_time,
    'Scheduled' AS action
FROM practical_assign_info pai
JOIN Technical_officer_assign toa ON pai.lab_ID = toa.Lab_ID
WHERE toa.TO_ID = ?
ORDER BY pai.schedule_date DESC, pai.schedule_time DESC
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $to_id);
$stmt->execute();
$result = $stmt->get_result();

$logs = [];
while ($row = $result->fetch_assoc()) {
    $logs[] = $row;
}

echo json_encode(['success' => true, 'data' => $logs]);
$conn->close();
