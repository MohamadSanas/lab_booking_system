<?php
header('Content-Type: application/json');
$conn = new mysqli("localhost", "root", "", "laboratory_booking_system");

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'DB connection error']);
    exit;
}

$lab_code = $_GET['lab_code'] ?? '';
if (!$lab_code) {
    echo json_encode(['success' => false, 'message' => 'Missing lab code']);
    exit;
}

$stmt = $conn->prepare("SELECT Instrument_code, Name, Quantity FROM instruments_info WHERE Lab_code = ?");
$stmt->bind_param("s", $lab_code);
$stmt->execute();
$result = $stmt->get_result();

$instruments = [];
while ($row = $result->fetch_assoc()) {
    $instruments[] = $row;
}

echo json_encode(['success' => true, 'instruments' => $instruments]);
?>
