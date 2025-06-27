<?php
session_start();
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (
    !isset($data['subject_ID'], $data['practical_ID'], $data['lab_ID'], $data['schedule_date'], $data['schedule_time'], $data['action'])
) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields.']);
    exit;
}

$subject_ID = $data['subject_ID'];
$practical_ID = $data['practical_ID'];
$lab_ID = $data['lab_ID'];
$schedule_date = $data['schedule_date'];
$schedule_time = $data['schedule_time'];
$action = $data['action'];
$instructor_ID = $_SESSION['userID'] ?? null;

if (!$instructor_ID) {
    echo json_encode(['success' => false, 'message' => 'Instructor not logged in.']);
    exit;
}

$conn = new mysqli("localhost", "root", "", "laboratory_booking_system");
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'DB connection failed.']);
    exit;
}

// Step 1: Insert or Update lab_booking table
$check = $conn->prepare("SELECT * FROM lab_booking WHERE subject_ID = ? AND practical_ID = ?");
$check->bind_param("ss", $subject_ID, $practical_ID);
$check->execute();
$result = $check->get_result();

if ($result->num_rows > 0) {
    $stmt = $conn->prepare("UPDATE lab_booking SET action = ?, schedule_date = ?, schedule_time = ?, lab_ID = ?, instructor_ID = ? WHERE subject_ID = ? AND practical_ID = ?");
    $stmt->bind_param("sssssss", $action, $schedule_date, $schedule_time, $lab_ID, $instructor_ID, $subject_ID, $practical_ID);
} else {
    $stmt = $conn->prepare("INSERT INTO lab_booking (subject_ID, practical_ID, lab_ID, instructor_ID, schedule_date, schedule_time, action) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sssssss", $subject_ID, $practical_ID, $lab_ID, $instructor_ID, $schedule_date, $schedule_time, $action);
}

if ($stmt->execute()) {
    // Step 2: Delete from practical_assign_info (ONLY IF status was finalized)
    $delete = $conn->prepare("DELETE FROM practical_assign_info WHERE subject_ID = ? AND practical_ID = ?");
    $delete->bind_param("ss", $subject_ID, $practical_ID);
    $delete->execute();

    echo json_encode(['success' => true, 'message' => "Status '$action' updated and removed from assignments."]);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to update lab status.']);
}

$stmt->close();
$conn->close();
?>
