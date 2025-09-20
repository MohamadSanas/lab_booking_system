<?php
session_start();
header('Content-Type: application/json');

$conn = new mysqli("localhost", "root", "", "laboratory_booking_system");

if ($conn->connect_error) {
    echo json_encode([]);
    exit;
}

// Assume student ID is stored in session
$studentID = $_SESSION['student_id'] ?? null;
if (!$studentID) {
    echo json_encode([]);
    exit;
}

// Get enrolled course codes
$courses = [];
$res = $conn->query("SELECT course_code FROM student_courses WHERE student_id = '$studentID'");
while ($row = $res->fetch_assoc()) {
    $courses[] = "'" . $conn->real_escape_string($row['course_code']) . "'";
}

if (empty($courses)) {
    echo json_encode([]);
    exit;
}

$courseList = implode(",", $courses);

// Fetch labs for enrolled courses
$sql = "
SELECT 
    s.course_code AS subject_ID,
    s.name AS course_name,
    l.Name AS lab_name,
    l.Lab_code AS lab_code,
    b.schedule_date,
    b.schedule_time,
    b.action AS status
FROM subjects s
JOIN lab_booking b ON b.subject_ID = s.course_code
JOIN laboratory l ON l.Lab_code = b.lab_ID
WHERE s.course_code IN ($courseList)
";

$result = $conn->query($sql);

$labs = [];
while ($row = $result->fetch_assoc()) {
    $labs[] = $row;
}

echo json_encode($labs);
