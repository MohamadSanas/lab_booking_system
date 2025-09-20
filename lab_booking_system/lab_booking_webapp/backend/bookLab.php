<?php
session_start();
header('Content-Type: application/json');

$conn = new mysqli("localhost", "root", "", "laboratory_booking_system");
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'DB Connection failed']);
    exit;
}

// Collect and sanitize POST data
$subject_ID = $_POST['course_code'] ?? '';
$practical_ID = $_POST['practical_id'] ?? '';
$lab_ID = $_POST['lab_code'] ?? '';
$instructor_ID = $_SESSION['userID'] ?? '';
$schedule_date = $_POST['lab_date'] ?? '';
$schedule_time = $_POST['lab_time'] ?? '';

// Validate data here (optional)...

// Check for overlapping bookings (3hrs block ± 2h 59m)
// Convert time to timestamp for easier calculation
$inputTime = strtotime($schedule_time);
$startWindow = date('H:i:s', $inputTime - 3 * 3600); // 3 hours before
$endWindow = date('H:i:s', $inputTime + 3 * 3600);   // 3 hours after

// Prepare query to check conflicts on same lab and date
$sqlCheck = "SELECT * FROM practical_assign_info WHERE lab_ID = ? AND schedule_date = ? AND (schedule_time BETWEEN ? AND ?)";
$stmtCheck = $conn->prepare($sqlCheck);
$checkStart = date('H:i:s', $inputTime - (2*3600 + 59*60)); // -2h 59m
$checkEnd = date('H:i:s', $inputTime + (2*3600 + 59*60));   // +2h 59m
$stmtCheck->bind_param("ssss", $lab_ID, $schedule_date, $checkStart, $checkEnd);
$stmtCheck->execute();
$resultCheck = $stmtCheck->get_result();

if ($resultCheck->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'Lab busy for this time slot.']);
    exit;
}

// Insert booking
$sqlInsert = "INSERT INTO practical_assign_info (subject_ID, practical_ID, lab_ID, instructor_ID, schedule_date, schedule_time) VALUES (?, ?, ?, ?, ?, ?)";
$stmtInsert = $conn->prepare($sqlInsert);
$stmtInsert->bind_param("ssssss", $subject_ID, $practical_ID, $lab_ID, $instructor_ID, $schedule_date, $schedule_time);

if ($stmtInsert->execute()) {
    // Fetch updated booking list for this instructor
    $sqlBookings = "SELECT pai.subject_ID, pai.practical_ID, pai.lab_ID, pai.schedule_date, pai.schedule_time, pi.Name AS practical_name
                    FROM practical_assign_info pai
                    JOIN practical_info pi ON pai.practical_ID = pi.Practical_ID
                    WHERE pai.instructor_ID = ?
                    ORDER BY pai.schedule_date DESC, pai.schedule_time DESC";
    $stmtBookings = $conn->prepare($sqlBookings);
    $stmtBookings->bind_param("s", $instructor_ID);
    $stmtBookings->execute();
    $resultBookings = $stmtBookings->get_result();

    $bookings = [];
    while ($row = $resultBookings->fetch_assoc()) {
        $bookings[] = $row;
    }

    echo json_encode(['success' => true, 'message' => 'Lab booked successfully.', 'bookings' => $bookings]);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to book lab.']);
}

$conn->close();
?>
