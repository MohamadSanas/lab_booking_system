// Show course section, hide lab section
function BookLabs() {
  document.getElementById('courseSection').style.display = 'block';
  document.getElementById('labSection').style.display = 'none';
}

// Show lab section, hide course section and load labs
function viewLabs() {
  document.getElementById('courseSection').style.display = 'none';
  document.getElementById('labSection').style.display = 'block';

  // Fetch lab schedule and update table
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

// Add new empty course row from template
function addNewCourse() {
  const template = document.getElementById('new-Course-Table');
  const clone = template.content.cloneNode(true);
  document.getElementById('courseTableBody').appendChild(clone);

  // Hide "No Course added yet" row if visible
  const noCourseRow = document.getElementById('noCourseRow');
  if (noCourseRow) noCourseRow.style.display = 'none';
}

// Fetch course info by course code and auto-fill inputs
function fetchCourseInfo(input) {
  const courseCode = input.value.trim();
  const row = input.closest('tr');
  const nameInput = row.querySelector('input[placeholder="course name"]');
  const creditInput = row.querySelector('input[placeholder="credit"]');
  const hoursInput = row.querySelector('input[placeholder="hours"]');

  if (courseCode === '') {
    nameInput.value = '';
    creditInput.value = '';
    hoursInput.value = '';
    return;
  }

  fetch('backend/getCourseInfo_for_std.php', {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: `course_code=${encodeURIComponent(courseCode)}`
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      nameInput.value = data.name;
      creditInput.value = data.credits;
      hoursInput.value = data.hours;
    } else {
      nameInput.value = '';
      creditInput.value = '';
      hoursInput.value = '';
      alert('Course not found!');
    }
  })
  .catch(err => {
    console.error('Fetch error:', err);
    alert('Error fetching course info.');
  });
}


// Save (enroll) course for student
function saveFunction(event) {
  const row = event.target.closest("tr");
  const codeInput = row.querySelector("td:nth-child(1) input");
  const courseCode = codeInput.value.trim();

  if (!courseCode) return alert("Enter course code");

  $.post("backend/enrollCourse.php", { course_code: courseCode }, function (res) {
    if (res.success) {
      alert(res.message);
      // Disable inputs
      row.querySelectorAll("input").forEach((input) => input.setAttribute("readonly", true));
      // Remove Save button
      event.target.remove();
    } else {
      alert(res.message);
    }
  }, "json");
}

// After successful enrollment, disable editing and update buttons
function makeRowPermanent(row) {
  row.querySelectorAll('input').forEach(input => {
    input.readOnly = true;
    input.classList.add('bg-light');
  });

  const actionCell = row.querySelector('td:last-child');
  actionCell.innerHTML = `<button class="btn btn-danger btn-sm" onclick="deleteCourse(this)">Delete</button>`;
}

// Cancel and remove a new course row
function cancelFunction(button) {
  const row = button.closest('tr');
  row.remove();

  // Show "No Course added yet" if no rows left
  if (document.querySelectorAll('#courseTableBody tr').length === 0) {
    const noCourseRow = document.getElementById('noCourseRow');
    if (noCourseRow) noCourseRow.style.display = '';
  }
}

// Delete enrolled course for student
function cancelFunction(btn) {
  const row = btn.closest("tr");
  const code = row.querySelector("td:nth-child(1) input").value.trim();

  if (!code) {
    row.remove();
    return;
  }

  $.post("backend/deleteEnrollment.php", { course_code: code }, function (res) {
    if (res.success) {
      row.remove();
      alert(res.message);
    } else {
      alert(res.message);
    }
  }, "json");
}

// Load student lab bookings
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

// Book lab function - submit booking form
function bookFunction(event) {
  event.preventDefault();
  const row = event.target.closest('tr');

  const courseCode = row.querySelector('.course-code').value.trim();

  const practicalSelect = row.querySelector('.practical-id');
  const practicalID = practicalSelect.value;

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
        // Remove the booking row (usually a new row for booking)
        row.remove();

        // Update the lab schedule table with latest bookings
        updateLabScheduleTable(data.bookings);

        // Switch to lab view
        viewLabs();
      }
    })
    .catch(err => {
      alert('Error booking lab: ' + err.message);
    });
}

// Update lab schedule table with bookings array
function updateLabScheduleTable(bookings) {
  const tbody = document.getElementById('labTableBody');
  tbody.innerHTML = ''; // Clear current rows

  if (!bookings || bookings.length === 0) {
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

// Fetch and populate practicals and labs dropdown based on course code input
function fetchPracticalList(input) {
  const courseCode = input.value.trim();
  const row = input.closest("tr");
  const practicalSelect = row.querySelector(".practical-id");
  const practicalNameInput = row.querySelector(".practical-name");
  const labSelect = row.querySelector(".lab-code");

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

// Auto-fill practical name when a practical is selected
function fillPracticalName(select) {
  const selectedOption = select.options[select.selectedIndex];
  const name = selectedOption.dataset.name || '';
  const row = select.closest("tr");
  const nameInput = row.querySelector(".practical-name");
  nameInput.value = name;
}

// Update lab status (Finished, Postponed, Canceled)
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
        viewLabs(); // reload lab table with updated data
      }
    })
    .catch(err => {
      alert('Error updating status: ' + err.message);
    });
}

// Show instruments list for a selected lab
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

function loadStudentLabs() {
  const tbody     = document.getElementById('labTableBody');
  const noLabsRow = document.getElementById('noLabsRow');

  fetch('backend/getStudentLabs.php')
    .then(res => res.json())
    .then(data => {
      tbody.innerHTML = ''; // clear existing rows

      if (!data.success || data.labs.length === 0) {
        noLabsRow.style.display = 'table-row';
        return;
      }

      noLabsRow.style.display = 'none';
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Normalize today's date

      data.labs.forEach(lab => {
        const labDate = new Date(lab.schedule_date);
        labDate.setHours(0, 0, 0, 0); // Normalize lab date

        let statusCell = '';

        if (labDate.getTime() === today.getTime()) {
          statusCell = `
            <button class="btn btn-success btn-sm" onclick="markAttendance('${lab.subject_ID}', '${lab.practical_ID}', true)">Attended</button>
            <button class="btn btn-danger btn-sm" onclick="markAttendance('${lab.subject_ID}', '${lab.practical_ID}', false)">Not Attended</button>
          `;
        } else if (labDate.getTime() < today.getTime()) {
          statusCell = `<span class="badge badge-danger">Missed</span>`;
        } else {
          statusCell = `<span class="badge badge-info">Scheduled</span>`;
        }

        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${lab.subject_ID}</td>
          <td>${lab.course_name}</td>
          <td>${lab.practical_name}</td>
          <td>${lab.lab_ID}</td>
          <td>${lab.schedule_date}</td>
          <td>${lab.schedule_time}</td>
          <td>${statusCell}</td>
        `;
        tbody.appendChild(tr);
      });
    })
    .catch(err => {
      console.error('Error loading student labs:', err);
      alert('Failed to load labs');
    });
}

function markAttendance(subject_ID, practical_ID, attended) {
  const msg = attended ? 'Marked as Attended' : 'Marked as Not Attended';
  alert(`${msg} for ${subject_ID} - ${practical_ID}`);

  // Optional: Add fetch POST to backend to save attendance in database
}


function addNewLab() {
  const template = document.getElementById('new-Course-Table');
  const clone = template.content.cloneNode(true);
  const tbody = document.getElementById('courseTableBody');

  // Hide "No Course added yet" row if visible
  const noCourseRow = document.getElementById('noCourseRow');
  if (noCourseRow) noCourseRow.style.display = 'none';

  tbody.appendChild(clone);
}





