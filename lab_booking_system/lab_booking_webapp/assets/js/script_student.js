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


function addNewCourse() {
  const template = document.getElementById('new-Course-Table');
  const clone = template.content.cloneNode(true);
  document.getElementById('courseTableBody').appendChild(clone);

  // Hide "No Course added yet" row if visible
  const noCourseRow = document.getElementById('noCourseRow');
  if (noCourseRow) noCourseRow.style.display = 'none';
}


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


function loadEnrolledCourses() {
    fetch("backend/fetch_enrolled_courses.php")
        .then(res => res.json())
        .then(data => {
            const tbody = document.getElementById("courseTableBody");
            const noRow = document.getElementById("noCourseRow");

            tbody.innerHTML = "";

            if (!data.success || data.data.length === 0) {
                noRow.style.display = "";
                return;
            }

            noRow.style.display = "none";

            data.data.forEach(course => {
                const tr = document.createElement("tr");

                tr.innerHTML = `
                    <td>${course.course_code}</td>
                    <td>${course.course_name}</td>
                    <td>${course.credit}</td>
                    <td>-</td>
                    <td>
                        <span class="badge badge-success">Enrolled</span>
                    </td>
                `;

                tbody.appendChild(tr);
            });
        })
        .catch(err => {
            console.error("Error loading enrolled courses:", err);
        });
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

window.onload = function () {
    loadEnrolledCourses();
    loadStudentLabs();
};

