<?php
require('fpdf/fpdf.php');

// Database connection
$conn = new mysqli("localhost", "root", "", "laboratory_booking_system");
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Fetch booking records from the correct table
$sql = "SELECT subject_ID, practical_ID, lab_ID, instructor_ID, schedule_date, schedule_time, action FROM lab_booking";
$result = $conn->query($sql);

if (!$result) {
    die("SQL Error: " . $conn->error);  // Shows what went wrong
}

// Create PDF
$pdf = new FPDF();
$pdf->AddPage();
$pdf->SetFont('Arial','B',14);
$pdf->Cell(0,10,'Lab Booking Log Report',0,1,'C');

$pdf->SetFont('Arial','B',10);
$pdf->Cell(30,10,'Subject ID',1);
$pdf->Cell(30,10,'Practical ID',1);
$pdf->Cell(20,10,'Lab ID',1);
$pdf->Cell(30,10,'Instructor ID',1);
$pdf->Cell(30,10,'Date',1);
$pdf->Cell(25,10,'Time',1);
$pdf->Cell(25,10,'Action',1);
$pdf->Ln();

$pdf->SetFont('Arial','',10);
while ($row = $result->fetch_assoc()) {
    $pdf->Cell(30,10,$row['subject_ID'],1);
    $pdf->Cell(30,10,$row['practical_ID'],1);
    $pdf->Cell(20,10,$row['lab_ID'],1);
    $pdf->Cell(30,10,$row['instructor_ID'],1);
    $pdf->Cell(30,10,$row['schedule_date'],1);
    $pdf->Cell(25,10,$row['schedule_time'],1);
    $pdf->Cell(25,10,$row['action'],1);
    $pdf->Ln();
}

$pdf->Output();
?>
