<?php
session_start();
header('Content-Type: application/json');

$conn = new mysqli("localhost", "root", "", "laboratory_booking_system");
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'DB Connection error']);
    exit;
}


$data = json_decode(file_get_contents("php://input"), true);

$subject_ID = $data['subject_ID'];
$practical_ID = $data['practical_ID'];
$lab_ID = $data['lab_ID'];
$instructor_ID = $data['instructor_ID'];
$schedule_date = $data['schedule_date'];
$schedule_time = $data['schedule_time'];
$action = $data['status'];

try {
    // Start transaction
    $conn->begin_transaction();

    // Insert into lab_booking
    $insert = $conn->prepare("INSERT INTO lab_booking 
        (subject_ID, practical_ID, lab_ID, instructor_ID, schedule_date, schedule_time, action)
        VALUES (?, ?, ?, ?, ?, ?, ?)");
    $insert->bind_param("sssssss", $subject_ID, $practical_ID, $lab_ID, $instructor_ID, $schedule_date, $schedule_time, $action);
    $insert->execute();

    // Delete from practical_assign_info
    $delete = $conn->prepare("DELETE FROM practical_assign_info WHERE subject_ID = ? AND practical_ID = ?");
    $delete->bind_param("ss", $subject_ID, $practical_ID);
    $delete->execute();

    $conn->commit();
    echo "success";

} catch (Exception $e) {
    $conn->rollback();
    http_response_code(500);
    echo "Error: " . $e->getMessage();
}
?>
