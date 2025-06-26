<?php
session_start();
header('Content-Type: application/json');

// Database connection
$conn = new mysqli("localhost", "root", "", "laboratory_booking_system");
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'DB Connection failed']);
    exit;
}

// Get logged-in instructor ID from session
$instructor_ID = $_SESSION['userID'] ?? '';
if (empty($instructor_ID)) {
    echo json_encode(['success' => false, 'message' => 'Instructor not logged in']);
    exit;
}

// Decode incoming JSON
$data = json_decode(file_get_contents("php://input"), true);

// Validate inputs
$subject_ID     = $data['subject_ID'] ?? '';
$practical_ID   = $data['practical_ID'] ?? '';
$lab_ID         = $data['lab_ID'] ?? '';
$schedule_date  = $data['schedule_date'] ?? '';
$schedule_time  = $data['schedule_time'] ?? '';
$action         = $data['action'] ?? '';  // 'Finished', 'Canceled', 'Postponed'

if (!$subject_ID || !$practical_ID || !$lab_ID || !$schedule_date || !$schedule_time || !$action) {
    echo json_encode(['success' => false, 'message' => 'Missing fields']);
    exit;
}

try {
    $conn->begin_transaction();

    // ✅ Insert into lab_booking
    $insert = $conn->prepare("INSERT INTO lab_booking 
        (subject_ID, practical_ID, lab_ID, instructor_ID, schedule_date, schedule_time, action)
        VALUES (?, ?, ?, ?, ?, ?, ?)");
    $insert->bind_param("sssssss", 
        $subject_ID, $practical_ID, $lab_ID, $instructor_ID, $schedule_date, $schedule_time, $action);
    $insert->execute();

    // ✅ Delete from practical_assign_info
    $delete = $conn->prepare("DELETE FROM practical_assign_info 
        WHERE subject_ID = ? AND practical_ID = ?");
    $delete->bind_param("ss", $subject_ID, $practical_ID);
    $delete->execute();

    $conn->commit();

    echo json_encode(['success' => true, 'message' => 'Lab status updated and saved.']);

} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}
?>
