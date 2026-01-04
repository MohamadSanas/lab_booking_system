function fillPracticalName(select) {
  const selectedOption = select.options[select.selectedIndex];
  const name = selectedOption.dataset.name || '';
  const row = select.closest("tr");
  const nameInput = row.querySelector(".practical-name");
  nameInput.value = name;
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



function cancelFunction(button) {
  const row = button.closest('tr');
  row.remove();

  // Show "No Course added yet" if no rows left
  if (document.querySelectorAll('#courseTableBody tr').length === 0) {
    const noCourseRow = document.getElementById('noCourseRow');
    if (noCourseRow) noCourseRow.style.display = '';
  }
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


function loadBookedLabs() {
  fetch("backend/fetch_booked_labs_for_instructor.php")
    .then(res => res.json())
    .then(labs => {
      const tbody = document.getElementById("labTableBody");
      const noRow = document.getElementById("noLabsRow");

      tbody.innerHTML = "";

      if (!labs || labs.length === 0) {
        noRow.style.display = "table-row";
        return;
      }

      noRow.style.display = "none";

      labs.forEach(lab => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${lab.subject_ID}</td>
          <td>${lab.practical_ID}</td>
          <td>${lab.practical_name}</td>
          <td>${lab.lab_ID}</td>
          <td>${lab.schedule_date}</td>
          <td>${lab.schedule_time}</td>
          <td>
            <span class="badge badge-info">
              ${lab.action || 'Scheduled'}
            </span>
          </td>
        `;
        tbody.appendChild(tr);
      });
    })
    .catch(err => {
      console.error("Error loading booked labs:", err);
    });
}
