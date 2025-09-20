<?php 
session_start();

// Database connection
$conn = new mysqli("localhost", "root", "", "laboratory_booking_system");

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Collect and sanitize POST data
$userID = isset($_POST["userID"]) ? trim($_POST["userID"]) : '';
$password = isset($_POST["password"]) ? trim($_POST["password"]) : '';

// Prepare SQL statement to prevent SQL injection
$sql = "SELECT * FROM users WHERE ID = ? AND password = ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    die("Prepare failed: " . $conn->error);
}

$stmt->bind_param("ss", $userID, $password);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $user = $result->fetch_assoc();

    // Save session info
    $_SESSION['userID'] = $user['ID'];
    $_SESSION['role'] = $user['role'];

    // Redirect based on role
    switch ($user["role"]) {
        case "student":
            header("Location: ../student.html");
            break;
        case "Technical_Officer":
            header("Location: ../technical_officer.html");
            break;
        case "Lecturer":
            header("Location: ../lecturer.php");
            break;
        case "Instructor":
            header("Location: ../instructor.html");
            break;
        default:
            echo "Unknown role!";
            exit;
    }

    exit;
} else {
    echo "Invalid username or password";
}

$conn->close();
?>
