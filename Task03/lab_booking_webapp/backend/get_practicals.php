<?php
// backend/getPracticals.php
if (!isset($_GET['course_code'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Course code required']);
    exit;
}

$courseCode = $_GET['course_code'];

$conn = new mysqli("localhost", "root", "", "laboratory_booking_system");

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$stmt = $conn->prepare("SELECT Practical_ID, Name FROM practical_info WHERE Subject_ID = ?");
$stmt->bind_param("s", $courseCode);
$stmt->execute();
$result = $stmt->get_result();

$practicals = [];
while ($row = $result->fetch_assoc()) {
    $practicals[] = $row;
}

header('Content-Type: application/json');
echo json_encode($practicals);

$conn->close();

