<?php 

session_start();

$conn = new mysqli("localhost", "root", "", "laboratory_booking_system");

if($conn->connect_error){
    die("connection failed" . $conn->connect_error);
}

$username=$_POST ["username"];
$password=$_POST ["password"];

$sql = "SELECT * FROM user WHERE ID = ? password = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $username, $password);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows == 1) {
    $user = $result->fetch_assoc();

    $_SESSION['user'] = $user['ID'];
    $_SESSION['role'] = $user['role'];

    if($user["role"]=="student"){
        header("");
    }else{
        header("");
    }
    exit;

}else{
    echo" Invalid username or password";
}

$conn->close();
?>

