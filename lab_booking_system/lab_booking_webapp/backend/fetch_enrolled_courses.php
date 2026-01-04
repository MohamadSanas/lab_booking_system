<?php
session_start();
header('Content-Type: application/json');

$conn = new mysqli("localhost", "root", "", "laboratory_booking_system");
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "DB connection failed"]);
    exit;
}

if (!isset($_SESSION['userID'])) {
    echo json_encode(["success" => false, "message" => "Not logged in"]);
    exit;
}

$studentID = $_SESSION['userID'];

$sql = "
SELECT 
    ec.subject_ID AS course_code,
    s.name AS course_name,
    s.credit AS credit
FROM enroll_course ec
JOIN subjects s ON ec.subject_ID = s.course_code
WHERE ec.student_ID = ?
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $studentID);
$stmt->execute();
$result = $stmt->get_result();

$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode([
    "success" => true,
    "data" => $data
]);

$conn->close();
