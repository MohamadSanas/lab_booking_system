// Load Booking Table (without action)
function loadLabBooking() {
  fetch('backend/fetch_lab_booking.php')
    .then(res => res.json())
    .then(data => {
      const tbody = document.getElementById("bookingTableBody");
      tbody.innerHTML = "";

      if (!data.success || data.data.length === 0) {
        tbody.innerHTML =
          `<tr><td colspan="6" class="text-center">No booking records found</td></tr>`;
        return;
      }

      data.data.forEach(item => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${item.subject_ID}</td>
          <td>${item.practical_ID}</td>
          <td>${item.lab_ID}</td>
          <td>${item.instructor_ID || '-'}</td>
          <td>${item.schedule_date}</td>
          <td>${item.schedule_time}</td>
        `;
        tbody.appendChild(tr);
      });
    })
    .catch(err => {
      console.error("Error loading booking data:", err);
      document.getElementById("bookingTableBody").innerHTML =
        `<tr><td colspan="6" class="text-center">Error loading data</td></tr>`;
    });
}


// Load Log Table (with action)
function loadLabLog() {
  fetch('backend/fetch_lab_log.php')
    .then(res => res.json())
    .then(data => {
      const tbody = document.getElementById("logTableBody");
      tbody.innerHTML = "";

      if (!data.success || data.data.length === 0) {
        tbody.innerHTML =
          `<tr><td colspan="7" class="text-center">No lab logs found</td></tr>`;
        return;
      }

      data.data.forEach(item => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${item.subject_ID}</td>
          <td>${item.practical_ID}</td>
          <td>${item.lab_ID}</td>
          <td>${item.instructor_ID || '-'}</td>
          <td>${item.schedule_date}</td>
          <td>${item.schedule_time}</td>
          <td>${item.action || '-'}</td>
        `;
        tbody.appendChild(tr);
      });
    })
    .catch(err => {
      console.error("Error loading lab log:", err);
      document.getElementById("logTableBody").innerHTML =
        `<tr><td colspan="7" class="text-center">Error loading data</td></tr>`;
    });
}


// Auto load on page refresh
window.onload = function () {
  loadLabBooking();
  loadLabLog();
};
