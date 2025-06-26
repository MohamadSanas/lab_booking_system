<?php
$conn = new mysqli("localhost", "root", "", "laboratory_booking_system");
if ($conn->connect_error) {
  echo json_encode(['success' => false, 'message' => 'DB failed']);
  exit;
}

$code = $_GET['code'];
$sql = $conn->prepare("SELECT name, credit FROM subjects WHERE course_code = ?");
$sql->bind_param("s", $code);
$sql->execute();
$result = $sql->get_result();

if ($row = $result->fetch_assoc()) {
  echo json_encode(['success' => true, 'name' => $row['name'], 'credit' => $row['credit']]);
} else {
  echo json_encode(['success' => false]);
}
