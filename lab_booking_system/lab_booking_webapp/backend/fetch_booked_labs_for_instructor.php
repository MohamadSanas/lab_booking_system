<?php
session_start();
header('Content-Type: application/json');

$conn = new mysqli("localhost", "root", "", "laboratory_booking_system");
if ($conn->connect_error) {
    echo json_encode([]);
    exit;
}

// ✅ get instructor ID from session
$instructorID = $_SESSION['userID'] ?? null;
if (!$instructorID) {
    echo json_encode([]);
    exit;
}

$sql = "
SELECT
    b.subject_ID,
    b.practical_ID,
    p.Name AS practical_name,
    b.lab_ID,
    b.schedule_date,
    b.schedule_time,
    b.action
FROM lab_booking b
JOIN practical_info p ON p.Practical_ID = b.practical_ID
WHERE b.instructor_ID = ?
ORDER BY b.schedule_date, b.schedule_time
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $instructorID);
$stmt->execute();
$result = $stmt->get_result();

$labs = [];
while ($row = $result->fetch_assoc()) {
    $labs[] = $row;
}

echo json_encode($labs);
$conn->close();
