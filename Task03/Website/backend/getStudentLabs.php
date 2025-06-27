<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['userID'])) {
    echo json_encode(['success' => false, 'message' => 'Not logged in']);
    exit;
}
$student_ID = $_SESSION['userID'];

$conn = new mysqli('localhost','root','','laboratory_booking_system');
if ($conn->connect_error) {
    echo json_encode(['success'=>false,'message'=>'DB error']);
    exit;
}

// 1) find subjects student enrolled in
$stmt = $conn->prepare("
  SELECT subject_ID
  FROM enroll_course
  WHERE student_ID = ?
");
$stmt->bind_param('s',$student_ID);
$stmt->execute();
$res = $stmt->get_result();

$subjects = [];
while($r = $res->fetch_assoc()){
  $subjects[] = $r['subject_ID'];
}
$stmt->close();

if (empty($subjects)) {
    echo json_encode(['success'=>true,'labs'=>[]]);
    exit;
}

// 2) build placeholder list (?,?…) and types
$ph = implode(',', array_fill(0, count($subjects), '?'));
$types = str_repeat('s', count($subjects));

// 3) fetch from practical_assign_info
$sql = "
  SELECT
    pai.subject_ID,
    s.name         AS course_name,
    pai.practical_ID,
    pi.Name        AS practical_name,
    pai.lab_ID,
    l.Name         AS lab_name,
    pai.schedule_date,
    pai.schedule_time
  FROM practical_assign_info AS pai
  JOIN subjects         AS s  ON pai.subject_ID   = s.course_code
  JOIN practical_info   AS pi ON pai.practical_ID = pi.Practical_ID
  JOIN laboratory       AS l  ON pai.lab_ID       = l.Lab_code
  WHERE pai.subject_ID IN ($ph)
  ORDER BY pai.schedule_date, pai.schedule_time
";
$stmt = $conn->prepare($sql);
$stmt->bind_param($types, ...$subjects);
$stmt->execute();
$res = $stmt->get_result();

$labs = [];
while($r = $res->fetch_assoc()) {
  $labs[] = $r;
}
$stmt->close();
$conn->close();

echo json_encode(['success'=>true,'labs'=>$labs]);
