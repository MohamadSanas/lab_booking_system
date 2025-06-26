<?php
require_once __DIR__ . '/vendor/autoload.php'; // Composer autoload

$conn = new mysqli("localhost", "root", "", "laboratory_booking_system");
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$result = $conn->query("SELECT * FROM lab_booking");

$html = '
<h2 style="text-align: center;">University of Jaffna - Lab Booking Report</h2>
<table border="1" width="100%" style="border-collapse: collapse;">
    <thead>
        <tr>
            <th>Course Code</th>
            <th>Practical ID</th>
            <th>Lab Code</th>
            <th>Instructor ID</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
        </tr>
    </thead>
    <tbody>';

while ($row = $result->fetch_assoc()) {
    $html .= "<tr>
        <td>{$row['subject_ID']}</td>
        <td>{$row['practical_ID']}</td>
        <td>{$row['lab_ID']}</td>
        <td>{$row['instructor_ID']}</td>
        <td>{$row['schedule_date']}</td>
        <td>{$row['schedule_time']}</td>
        <td>{$row['action']}</td>
    </tr>";
}

$html .= '</tbody></table>';

// Generate PDF
$mpdf = new \Mpdf\Mpdf();
$mpdf->WriteHTML($html);
$mpdf->Output('Lab_Report.pdf', 'I'); // 'I' = open in browser, 'D' = download
?>
