<?php
// backend/getLabsByCourse.php
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

// Get department of the subject
$deptQuery = $conn->prepare("SELECT Dept_ID FROM subjects WHERE course_code = ?");
$deptQuery->bind_param("s", $courseCode);
$deptQuery->execute();
$deptResult = $deptQuery->get_result();

if ($deptResult->num_rows === 0) {
    echo json_encode([]);
    exit;
}

$deptRow = $deptResult->fetch_assoc();
$deptId = $deptRow['Dept_ID'];

// Get labs in that department
$labsQuery = $conn->prepare("SELECT Lab_code, Name FROM laboratory WHERE Dept_ID = ?");
$labsQuery->bind_param("s", $deptId);
$labsQuery->execute();
$labsResult = $labsQuery->get_result();

$labs = [];
while ($row = $labsResult->fetch_assoc()) {
    $labs[] = $row;
}

header('Content-Type: application/json');
echo json_encode($labs);

$conn->close();
