<?php
header('Content-Type: application/json');
$conn = new mysqli("localhost", "root", "", "laboratory_booking_system");

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'DB Connection failed']);
    exit;
}

$sql = "SELECT * FROM lab_booking ORDER BY schedule_date DESC, schedule_time DESC";
$result = $conn->query($sql);

$logs = [];
while ($row = $result->fetch_assoc()) {
    $logs[] = $row;
}

echo json_encode(['success' => true, 'data' => $logs]);
