<?php
session_start();
header('Content-Type: application/json');

$conn = new mysqli("localhost", "root", "", "laboratory_booking_system");
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'DB Connection error']);
    exit;
}

$instructor_ID = $_SESSION['userID'] ?? '';

if (empty($instructor_ID)) {
    echo json_encode(['success' => false, 'message' => 'Instructor not logged in']);
    exit;
}

$sql = "SELECT pai.subject_ID, pai.practical_ID, pai.lab_ID, pai.schedule_date, pai.schedule_time, pi.Name AS practical_name
        FROM practical_assign_info pai
        JOIN practical_info pi ON pai.practical_ID = pi.Practical_ID
        WHERE pai.instructor_ID = ?
        ORDER BY pai.schedule_date DESC, pai.schedule_time DESC";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $instructor_ID);
$stmt->execute();
$result = $stmt->get_result();

$bookings = [];
while ($row = $result->fetch_assoc()) {
    $bookings[] = $row;
}

echo json_encode(['success' => true, 'bookings' => $bookings]);
?>
