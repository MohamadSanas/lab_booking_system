<?php
// Connect to database
$conn = new mysqli("localhost", "root", "", "laboratory_booking_system");
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'error' => 'DB Connection Failed']);
    exit;
}

$courseCode = $_POST['course_code'] ?? '';

if ($courseCode === '') {
    echo json_encode(['success' => false, 'error' => 'No course code']);
    exit;
}

$sql = "SELECT * FROM course WHERE course_code = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $courseCode);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    echo json_encode([
        'success' => true,
        'name' => $row['course_name'],
        'credits' => $row['credits'],
        'hours' => $row['hours']
    ]);
} else {
    echo json_encode(['success' => false]);
}
?>
