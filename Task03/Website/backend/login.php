<?php 
session_start();

// Database connection
$conn = new mysqli("localhost", "root", "", "laboratory_booking_system");

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Collect POST data
$userID = $_POST["userID"];
$password = $_POST["password"];

// Prepare SQL statement to prevent SQL injection
$sql = "SELECT * FROM users WHERE ID = ? AND password = ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    die("Prepare failed: " . $conn->error); // Show the real error if prepare fails
}

$stmt->bind_param("ss", $userID, $password);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows == 1) {
    $user = $result->fetch_assoc();

    // Save session info
    $_SESSION['userID'] = $user['ID'];
    $_SESSION['role'] = $user['role'];

    // Redirect based on role
    if ($user["role"] == "student") {
        header("Location: ../student.php");
    } else if ($user["role"] == "admin") {
        header("Location: ../admin.php"); // Replace with actual admin page if different
    } else {
        echo "Unknown role!";
    }
    exit;
} else {
    echo "Invalid username or password";
}

$conn->close();
?>
