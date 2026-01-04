<?php
session_start();
header('Content-Type: application/json');

$conn = new mysqli("localhost", "root", "", "laboratory_booking_system");
if ($conn->connect_error) {
    echo json_encode([]);
    exit;
}

// ✅ correct session key
$studentID = $_SESSION['userID'] ?? null;
if (!$studentID) {
    echo json_encode([]);
    exit;
}

/*
 DB tables used:
 - enroll_course (student_ID, subject_ID)
 - lab_booking
 - subjects
 - laboratory
*/

$sql = "
SELECT 
    ec.subject_ID,
    s.name AS course_name,
    l.Name AS lab_name,
    l.Lab_code AS lab_code,
    b.schedule_date,
    b.schedule_time,
    b.action AS status
FROM enroll_course ec
JOIN lab_booking b ON b.subject_ID = ec.subject_ID
JOIN subjects s ON s.course_code = ec.subject_ID
JOIN laboratory l ON l.Lab_code = b.lab_ID
WHERE ec.student_ID = ?
ORDER BY b.schedule_date, b.schedule_time
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $studentID);
$stmt->execute();
$result = $stmt->get_result();

$labs = [];
while ($row = $result->fetch_assoc()) {
    $labs[] = $row;
}

echo json_encode($labs);
$conn->close();
