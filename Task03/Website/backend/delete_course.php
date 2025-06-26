<?php
session_start();
$conn = new mysqli("localhost", "root", "", "laboratory_booking_system");

$data = json_decode(file_get_contents("php://input"), true);
$student_ID = $_SESSION['student_ID'];
$subject_ID = $data['subject_ID'];

$stmt = $conn->prepare("DELETE FROM enroll_course WHERE student_ID = ? AND subject_ID = ?");
$stmt->bind_param("ss", $student_ID, $subject_ID);

if ($stmt->execute()) {
  echo "success";
} else {
  echo "error";
}
