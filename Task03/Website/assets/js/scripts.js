function addNewCourse() {
    const noCourseRow = document.getElementById("noCourseRow");
    if (noCourseRow) {
        noCourseRow.style.display = "none";
    }

    const template = document.getElementById("new_Course_Table");
    const clone = template.content.cloneNode(true);

    const tableBody = document.getElementById("courseTableBody");
    tableBody.appendChild(clone);
}

function saveFunction(event) {
    const row = event.target.closest('tr');

    const code = row.querySelector('.form_control_code').value;
    const name = row.querySelector('.form_control_name').value;
    const credit = row.querySelector('.form_control_credit').value;
    const hours = row.querySelector('.form_control_hours').value;

    if (!code || !name || !credit || !hours) {
        alert("Please fill all fields");
        return;
    }

    row.innerHTML = `
        <td>${code}</td>
        <td>${name}</td>
        <td>${credit}</td>
        <td>${hours}</td>
        <td>
            <button class="btn btn-warning btn-sm" onclick="editRow(this)">Edit</button>
            <button class="btn btn-danger btn-sm" onclick="deleteRow(this)">Delete</button>
        </td>
    `;
}

function editRow(button) {
    const row = button.closest('tr');
    const cells = row.querySelectorAll('td');

    const code = cells[0].innerText;
    const name = cells[1].innerText;
    const credit = cells[2].innerText;
    const hours = cells[3].innerText;

    row.innerHTML = `
        <td><input type="text" class="form_control_code" value="${code}" style="font-size: 13px;"></td>
        <td><input type="text" class="form_control_name" value="${name}" style="font-size: 13px;"></td>
        <td><input type="number" class="form_control_credit" value="${credit}" style="font-size: 13px;"></td>
        <td><input type="number" class="form_control_hours" value="${hours}" style="font-size: 13px;"></td>
        <td>
            <button class="btn btn-success btn-sm" onclick="saveFunction(event)">Save</button>
            <button class="btn btn-danger btn-sm" onclick="cancelFunction(this)">Cancel</button>
        </td>
    `;
}

function deleteRow(button) {
    const row = button.closest('tr');
    row.remove();

    const tableBody = document.getElementById("courseTableBody");
    if (tableBody.children.length === 0) {
        document.getElementById("noCourseRow").style.display = "table-row";
    }
}

function cancelFunction(button) {
    const row = button.closest('tr');
    row.remove();

    const tableBody = document.getElementById("courseTableBody");
    if (tableBody.children.length === 0) {
        document.getElementById("noCourseRow").style.display = "table-row";
    }
}
