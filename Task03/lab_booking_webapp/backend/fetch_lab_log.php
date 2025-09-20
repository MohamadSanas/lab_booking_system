<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['userID']) || $_SESSION['role'] !== 'Technical_Officer') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

$to_id = $_SESSION['userID'];

$conn = new mysqli("localhost", "root", "", "laboratory_booking_system");
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

$sql = "
SELECT 
    lb.subject_ID,
    lb.practical_ID,
    lb.lab_ID,
    lb.instructor_ID,
    lb.schedule_date,
    lb.schedule_time,
    lb.action
FROM lab_booking lb
JOIN Technical_officer_assign toa ON lb.lab_ID = toa.Lab_ID
WHERE toa.TO_ID = ?
ORDER BY lb.schedule_date DESC, lb.schedule_time DESC
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
?>
