<?php
include 'db_connection.php'; // or your database connection logic
$subject_ID = $_POST['subject_ID'];
$practical_ID = $_POST['practical_ID'];
$status = $_POST['status'];

$sql = "UPDATE practical_assign_info 
        SET status = ? 
        WHERE subject_ID = ? AND practical_ID = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("sss", $status, $subject_ID, $practical_ID);
$stmt->execute();

echo "success";
