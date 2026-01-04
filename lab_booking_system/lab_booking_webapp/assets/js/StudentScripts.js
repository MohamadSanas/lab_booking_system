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


// Fetch course info by course code and auto-fill inputs

// Save (enroll) course for student


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


// Delete enrolled course for student

// Load student lab bookings


// Book lab function - submit booking form


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


// Auto-fill practical name when a practical is selected


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








