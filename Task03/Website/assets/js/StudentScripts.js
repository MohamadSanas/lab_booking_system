function BookLabs() {
  document.getElementById('courseSection').style.display = 'block';
  document.getElementById('labSection').style.display = 'none';
}

function viewLabs() {
  document.getElementById('courseSection').style.display = 'none';
  document.getElementById('labSection').style.display = 'block';
}

function addNewCourse() {
  const template = document.getElementById('new-Course-Table');
  const clone = template.content.cloneNode(true);
  document.getElementById('courseTableBody').appendChild(clone);

  // Hide "No Course added yet" row if visible
  const noCourseRow = document.getElementById('noCourseRow');
  if (noCourseRow) noCourseRow.style.display = 'none';
}

// Auto-fill course data

function fetchCourseInfo(input) {
  const courseCode = input.value.trim();
  const row = input.closest("tr");
  const nameInput = row.querySelector("td:nth-child(2) input");
  const creditInput = row.querySelector("td:nth-child(3) input");
  const hourInput = row.querySelector("td:nth-child(4) input");

  if (courseCode === "") {
    nameInput.value = "";
    creditInput.value = "";
    hourInput.value = "";
    return;
  }

  $.ajax({
    url: "backend/getCourseInfo_for_std.php",
    method: "POST",
    data: { course_code: courseCode },
    success: function(response) {
      const data = JSON.parse(response);
      if (data.success) {
        nameInput.value = data.name;
        creditInput.value = data.credits;
        hourInput.value = data.hours;
      } else {
        alert("Course not found!");
        nameInput.value = "";
        creditInput.value = "";
        hourInput.value = "";
      }
    },
    error: function(xhr, status, error) {
      console.error("AJAX Error:", error);
      alert("Error fetching course details.");
    }
  });
}


function clearCourseRow(row) {
  row.querySelectorAll('input').forEach(input => {
    if (input.placeholder !== "course code") {
      input.value = '';
    }
  });
}





function addNewLab() {
  const template = document.getElementById("new-Course-Table");
  const clone = template.content.cloneNode(true);

  const noCourseRow = document.getElementById("noCourseRow");
  if (noCourseRow) noCourseRow.style.display = "none";

  document.getElementById("courseTableBody").appendChild(clone);
}




function cancelFunction(btn) {
  const row = btn.closest("tr");
  row.remove();

  const tableBody = document.getElementById("courseTableBody");
  if (tableBody.children.length === 0) {
    document.getElementById("noCourseRow").style.display = "table-row";
  }
}




function saveFunction(event) {
  const btn = event.target;
  const row = btn.closest('tr');

  const courseCodeInput = row.querySelector('input[placeholder="course code"]');
  const courseNameInput = row.querySelector('input[placeholder="course name"]');
  const creditInput = row.querySelector('input[placeholder="credit"]');
  const hoursInput = row.querySelector('input[placeholder="hours"]');

  const courseCode = courseCodeInput.value.trim().toUpperCase();
  const courseName = courseNameInput.value.trim();
  const credit = creditInput.value.trim();
  const hours = hoursInput.value.trim();

  if (!courseCode) {
    alert("Please enter a course code");
    return;
  }

  if (!courseName) {
    alert("Invalid course code or course not found.");
    return;
  }

  // AJAX POST request to enroll the course for the student
  fetch('backend/enrollCourse.php', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      student_ID: student_ID,
      subject_ID: courseCode,
      subject_name: courseName,
      credit: credit,
      hours: hours
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      alert('Course enrolled successfully');
      makeRowPermanent(row);
    } else {
      alert('Failed to enroll course: ' + data.message);
    }
  })
  .catch(err => {
    console.error(err);
    alert('Error during enrollment');
  });
}

function makeRowPermanent(row) {
  // Disable all inputs except course code (optional)
  row.querySelectorAll('input').forEach(input => {
    input.readOnly = true;
    input.classList.add('bg-light');
  });

  // Replace Save/Cancel buttons with Delete button
  const actionCell = row.querySelector('td:last-child');
  actionCell.innerHTML = `<button class="btn btn-danger btn-sm" onclick="deleteCourse(this)">Delete</button>`;
}

// Called when Cancel button clicked on new row
function cancelFunction(button) {
  const row = button.closest('tr');
  row.remove();

  // If no rows left, show the "No Course added yet" row
  if (document.querySelectorAll('#courseTableBody tr').length === 0) {
    const noCourseRow = document.getElementById('noCourseRow');
    if (noCourseRow) noCourseRow.style.display = '';
  }
}


function deleteCourse(button) {
  const row = button.closest('tr');
  const courseCode = row.querySelector('input[placeholder="course code"]').value.trim().toUpperCase();

  if (!confirm('Are you sure you want to delete this enrolled course?')) return;

  fetch('backend/deleteEnrollCourse.php', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      student_ID: student_ID,
      subject_ID: courseCode
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      alert('Course enrollment deleted');
      row.remove();

      // If no rows left, show the "No Course added yet" row
      if (document.querySelectorAll('#courseTableBody tr').length === 0) {
        const noCourseRow = document.getElementById('noCourseRow');
        if (noCourseRow) noCourseRow.style.display = '';
      }
    } else {
      alert('Failed to delete enrollment: ' + data.message);
    }
  })
  .catch(err => {
    console.error(err);
    alert('Error deleting enrollment');
  });
}


// Edit Course
function editCourse(btn) {
  const row = btn.closest("tr");
  const courseCode = row.children[0].querySelector("input");

  if (courseCode) courseCode.removeAttribute("readonly");
}

function deleteCourse(btn) {
  const row = btn.closest("tr");
  const subject_ID = row.querySelector("input").value;

  if (!confirm("Delete this course?")) return;

  fetch("backend/delete_course.php", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subject_ID })
  }).then(res => res.text())
    .then(res => {
      if (res === "success") {
        row.remove();
      } else {
        alert("Delete failed: " + res);
      }
    });
}

function cancelFunction(btn) {
  const row = btn.closest("tr");
  row.remove();
}



function loadStudentLabs() {
  fetch("backend/fetch_labs_for_student.php")
    .then(res => res.json())
    .then(labs => {
      const tbody = document.getElementById("labTableBody");
      tbody.innerHTML = "";

      if (labs.length === 0) {
        document.getElementById("noLabsRow").style.display = "table-row";
        return;
      }

      document.getElementById("noLabsRow").style.display = "none";

      labs.forEach(lab => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${lab.subject_ID}</td>
          <td>${lab.course_name}</td>
          <td>${lab.lab_name}</td>
          <td>${lab.lab_code}</td>
          <td>${lab.schedule_date}</td>
          <td>${lab.schedule_time}</td>
          <td><span class="badge badge-info">${lab.status || 'Coming Soon'}</span></td>
        `;
        tbody.appendChild(tr);
      });
    })
    .catch(err => {
      console.error("Error loading student labs:", err);
    });
}



function bookFunction(event) {
    event.preventDefault();
    const row = event.target.closest('tr');

    const courseCode = row.querySelector('.course-code').value.trim();
    const practicalSelect = row.querySelector('.practical-id');
    const practicalID = practicalSelect.value;
    const practicalNameInput = row.querySelector('.practical-name');
    const labSelect = row.querySelector('.lab-code');
    const labCode = labSelect.value;
    const labDate = row.querySelector('.lab-date').value;
    const labTime = row.querySelector('.lab-time').value;

    if (!courseCode || !practicalID || !labCode || !labDate || !labTime) {
        alert('Please fill all required fields!');
        return;
    }

    const formData = new FormData();
    formData.append('course_code', courseCode);
    formData.append('practical_id', practicalID);
    formData.append('lab_code', labCode);
    formData.append('lab_date', labDate);
    formData.append('lab_time', labTime);

    fetch('backend/bookLab.php', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);

        if (data.success) {
            // Clear the new lab booking row
            row.remove();

            // Update the lab schedule table with bookings
            updateLabScheduleTable(data.bookings);

            // Show the lab schedule section
            viewLabs();
        }
    })
    .catch(err => {
        alert('Error booking lab: ' + err.message);
    });
}

function updateLabScheduleTable(bookings) {
    const tbody = document.getElementById('labTableBody');
    tbody.innerHTML = ''; // Clear existing rows

    if (bookings.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center">No Labs yet</td></tr>`;
        return;
    }

    bookings.forEach(booking => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td>${booking.subject_ID}</td>
            <td>${booking.practical_ID}</td>
            <td>${booking.practical_name}</td>
            <td>${booking.lab_ID}</td>
            <td>${booking.schedule_date}</td>
            <td>${booking.schedule_time}</td>
            <td>
              <button class="btn btn-success btn-sm" onclick="updateLabStatus('${booking.subject_ID}', '${booking.practical_ID}', '${booking.lab_ID}', '${booking.schedule_date}', '${booking.schedule_time}', 'Finished')">Finished</button>
              <button class="btn btn-warning btn-sm" onclick="updateLabStatus('${booking.subject_ID}', '${booking.practical_ID}', '${booking.lab_ID}', '${booking.schedule_date}', '${booking.schedule_time}', 'Postponed')">Postponed</button>
              <button class="btn btn-danger btn-sm" onclick="updateLabStatus('${booking.subject_ID}', '${booking.practical_ID}', '${booking.lab_ID}', '${booking.schedule_date}', '${booking.schedule_time}', 'Canceled')">Canceled</button>
            </td>

        `;

        tbody.appendChild(tr);
    });
}




function fetchPracticalList(input) {
    const courseCode = input.value.trim();
    const row = input.closest("tr");
    const practicalSelect = row.querySelector(".practical-id");
    const practicalNameInput = row.querySelector(".practical-name");
    const labSelect = row.querySelector(".lab-code");

    // Clear previous data
    practicalSelect.innerHTML = '<option value="">Select Practical</option>';
    practicalNameInput.value = "";
    labSelect.innerHTML = '<option value="">Select Lab</option>';

    if (!courseCode) return;

    // Fetch practicals
    fetch(`backend/get_practicals.php?course_code=${encodeURIComponent(courseCode)}`)
        .then(response => response.json())
        .then(data => {
            data.forEach(practical => {
                const option = document.createElement("option");
                option.value = practical.Practical_ID;
                option.textContent = practical.Practical_ID;
                option.dataset.name = practical.Name;
                practicalSelect.appendChild(option);
            });
        });

    // Fetch labs
    fetch(`backend/get_Labs_ByCourse.php?course_code=${encodeURIComponent(courseCode)}`)
        .then(response => response.json())
        .then(data => {
            data.forEach(lab => {
                const option = document.createElement("option");
                option.value = lab.Lab_code;
                option.textContent = `${lab.Lab_code} - ${lab.Name}`;
                labSelect.appendChild(option);
            });
        });
}


function fillPracticalName(select) {
    const selectedOption = select.options[select.selectedIndex];
    const name = selectedOption.dataset.name || '';
    const row = select.closest("tr");
    const nameInput = row.querySelector(".practical-name");
    nameInput.value = name;
}

function viewLabs() {
    document.getElementById('courseSection').style.display = 'none';
    document.getElementById('labSection').style.display = 'block';

    fetch('backend/fetch_lab_schedule.php')
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                updateLabScheduleTable(data.bookings);
            } else {
                alert(data.message);
            }
        })
        .catch(err => {
            alert('Error loading lab schedule: ' + err.message);
        });
}

function renderStatusCell(lab) {
    const today = new Date().toISOString().split("T")[0];
    const rowDate = lab.schedule_date;

    if (rowDate < today && lab.status === 'Coming Soon') {
        return `
            <button class="btn btn-success btn-sm" onclick="updateStatus('${lab.subject_ID}', '${lab.practical_ID}', 'Finished')">Finished</button>
            <button class="btn btn-warning btn-sm" onclick="updateStatus('${lab.subject_ID}', '${lab.practical_ID}', 'Postponed')">Postponed</button>
            <button class="btn btn-danger btn-sm" onclick="updateStatus('${lab.subject_ID}', '${lab.practical_ID}', 'Canceled')">Canceled</button>
        `;
    } else {
        return `<span class="badge badge-${getStatusClass(lab.status)}">${lab.status}</span>`;
    }
}

function getStatusClass(status) {
    switch(status) {
        case 'Finished': return 'success';
        case 'Postponed': return 'warning';
        case 'Canceled': return 'danger';
        default: return 'info';
    }
}

function updateStatus(subjectID, practicalID, status) {
    $.post("backend/update_status.php", {
        subject_ID: subjectID,
        practical_ID: practicalID,
        status: status
    }, function(response) {
        if (response === "success") {
            loadLabSchedule(); // reload table to reflect status
        }
    });
}

// This script assumes labs are fetched and injected into the table dynamically
function loadBookedLabs() {
  fetch('server/fetchBookedLabs.php') // Adjust this path as per your project
    .then(res => res.json())
    .then(labs => {
      const tbody = document.getElementById('labTableBody');
      tbody.innerHTML = '';
      
      if (labs.length === 0) {
        tbody.innerHTML = '<tr id="noLabsRow"><td colspan="8" class="text-center">No Labs yet</td></tr>';
        return;
      }

      const today = new Date().toISOString().split('T')[0];

      labs.sort((a, b) => new Date(a.schedule_date) - new Date(b.schedule_date));

      labs.forEach(lab => {
        const tr = document.createElement('tr');

        const labDate = lab.schedule_date;
        const isPast = labDate < today;

        let statusCell = '';
        if (!lab.status && isPast) {
          statusCell = `
            <button class="btn btn-sm btn-success" onclick="updateStatus(this, 'Finished', '${lab.subject_ID}', '${lab.practical_ID}', '${lab.lab_ID}', '${labDate}')">Finished</button>
            <button class="btn btn-sm btn-warning" onclick="updateStatus(this, 'Postponed', '${lab.subject_ID}', '${lab.practical_ID}', '${lab.lab_ID}', '${labDate}')">Postponed</button>
            <button class="btn btn-sm btn-danger" onclick="updateStatus(this, 'Canceled', '${lab.subject_ID}', '${lab.practical_ID}', '${lab.lab_ID}', '${labDate}')">Canceled</button>
          `;
        } else {
          statusCell = lab.status ? `<span class="badge badge-info">${lab.status}</span>` : '<span class="badge badge-secondary">Coming Soon</span>';
        }

        tr.innerHTML = `
          <td>${lab.subject_ID}</td>
          <td>${lab.practical_ID}</td>
          <td>${lab.practical_name}</td>
          <td>${lab.lab_ID}</td>
          <td>${lab.schedule_date}</td>
          <td>${lab.schedule_time}</td>
          <td>${statusCell}</td>
        `;
        tbody.appendChild(tr);
      });
    });
}

function updateLabStatus(subject_ID, practical_ID, lab_ID, schedule_date, schedule_time, action) {
  fetch('backend/updateLabStatus.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      subject_ID,
      practical_ID,
      lab_ID,
      schedule_date,
      schedule_time,
      action
    })
  })
  .then(res => res.json())
  .then(data => {
    alert(data.message);
    if (data.success) {
      viewLabs(); // refresh table
    }
  })
  .catch(err => {
    alert('Error updating status: ' + err.message);
  });
}



function handleLabAction(button, status, subject_ID, practical_ID, lab_ID, schedule_date, schedule_time, instructor_ID) {
    fetch('backend/updateLabStatus.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            subject_ID,
            practical_ID,
            lab_ID,
            instructor_ID,
            schedule_date,
            schedule_time,
            status
        })
    })
    .then(res => res.text())
    .then(response => {
        if (response === 'success') {
            // Remove row from the table
            const row = button.closest('tr');
            row.remove();
        } else {
            alert('Failed to update lab status.');
        }
    })
    .catch(err => {
        alert('Error: ' + err.message);
    });
}

function showInstruments(select) {
    const labCode = select.value;
    const row = select.closest("tr");
    const instrumentDiv = row.querySelector(".instrument-list");

    instrumentDiv.innerHTML = "Loading instruments...";

    if (!labCode) {
        instrumentDiv.innerHTML = "";
        return;
    }

    fetch(`backend/get_instruments_by_lab.php?lab_code=${encodeURIComponent(labCode)}`)
        .then(res => res.json())
        .then(data => {
            if (data.success && data.instruments.length > 0) {
                const list = data.instruments.map(inst =>
                    `<li>${inst.Name} (Code: ${inst.Instrument_code}) - Qty: ${inst.Quantity}</li>`
                ).join('');
                instrumentDiv.innerHTML = `<ul class="mb-0">${list}</ul>`;
            } else {
                instrumentDiv.innerHTML = "No instruments available.";
            }
        })
        .catch(() => {
            instrumentDiv.innerHTML = "Error loading instruments.";
        });
}
















