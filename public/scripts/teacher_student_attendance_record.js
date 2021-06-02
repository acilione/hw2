function getTeacherAttendanceRecordClassesNums() 
{
    return fetch('list_teacher_classes_numbers.php')
    .then(onResponse)
    .then(onJSON)
    .catch(onError);
}
function getTeacherAttendanceRecordClassesSections() 
{
    return fetch('list_teacher_classes_sections.php')
    .then(onResponse)
    .then(onJSON)
    .catch(onError);
}
function postStudentGetAttendance(studentCF) {
    return fetch('list_teacher_student_attendance.php', {
	method: 'POST',
	body: JSON.stringify({
		student_cf: studentCF
	}),
	headers: {
		'Content-type': 'application/x-www-form-urlencoded'
	}
    })    
    .then(onResponse)
    .then(onJSON)
    .catch(onError);
}
function postStudentModifyAttendanceData(formData)
{
    return fetch('query_modify_student_attendance.php', {
    method: 'POST',
    body: JSON.stringify({
        student_id: formData.student_modify_attendance_ID.value,
        attendance_date: formData.student_modify_attendance_date.value,
        attendance_value: formData.student_modify_attendance_value.value,
    }),
    headers: {
        'Content-type': 'application/x-www-form-urlencoded'
    }
    })    
    .then(onResponse)
    .then(onJSON)
    .catch(onError);
}
function filterRows(string, column_class)
{
    let text = string.toLowerCase();
    let rows = document.querySelectorAll('#attendance-table-block #students-attendance-list tr');
    if (text !== "") {
        for(let i=1; i<rows.length; i++){
            let row_content = rows[i].querySelector('.'+column_class).textContent.toLowerCase();
            if (row_content.indexOf(text) === -1) {
                rows[i].classList.add('hidden');
            }
            else {
                rows[i].classList.remove('hidden');
            }
        }
    }
    else {
        for (let i=1; i<rows.length; i++) {
            rows[i].classList.remove('hidden');
        }
    }
}
function handleSearch(event) 
{
    const filter_opt = document.querySelector('#attendance-filter-options').value;
    filterRows(event.target.value, filter_opt);
}
function handleTeacherAtteandanceRecordClassChange()
{
    const cfSelector = document.querySelector('#student-to-view-attendance-record');
    removeAllChildren(cfSelector);
    classNumValue = document.querySelector('#student-view-attendance-class-num').value;
    classSectionValue = document.querySelector('#student-view-attendance-class-section').value;
    postClassGetStudents(classNumValue, classSectionValue)
    .then(function(data){
        const cfSelector = document.querySelector('#student-to-view-attendance-record');
        for (d of data)
        {
            const cfOption = document.createElement('option');
            cfOption.setAttribute('value', d['cf']);
            const cfFullNameValue = document.createTextNode(d['cf']+" - "+d['nome']+" "+d['cognome']);
            cfSelector.appendChild(cfOption);
            cfOption.appendChild(cfFullNameValue);
        }
    });
}
function updateStudentAttendances()
{
    //genera opzioni con numeri classi relative un dato insegnante
    getTeacherAttendanceRecordClassesNums().then(function(data)
    {
        const classNum = document.querySelector('#student-view-attendance-class-num');
        removeAllChildren(classNum);
        for (d of data)
        {
            const numOption = document.createElement('option');
            const numValue = document.createTextNode(d['numero']);
            classNum.appendChild(numOption);
            numOption.appendChild(numValue)
            numOption.setAttribute('value', d['numero']);
        }
        classNum.addEventListener('change', handleTeacherAtteandanceRecordClassChange);
    });
    //genera opzioni con sezioni classi relative a un dato insegnante
    getTeacherAttendanceRecordClassesSections().then(function(data)
    {
        const classSection = document.querySelector('#student-view-attendance-class-section');
        removeAllChildren(classSection);
        for (d of data)
        {
            const sectionOption = document.createElement('option');
            const sectionValue = document.createTextNode(d['sezione']);
            classSection.appendChild(sectionOption);
            sectionOption.appendChild(sectionValue)
            sectionOption.setAttribute('value', d['sezione']);
        }
        classSection.addEventListener('change', handleTeacherAtteandanceRecordClassChange);
        handleTeacherAtteandanceRecordClassChange();
    });
    document.querySelector('#student-to-view-attendance-record').addEventListener('change', handleStudentToViewAttendanceOptionChange);
}
function handleStudentToViewAttendanceOptionChange(event)
{
    const cfValue = event.target.value;
    postStudentGetAttendance(cfValue).then(function(data){
        const c = document.querySelector('#attendance-table-block');
        c.classList.add('scrollable');
        removeAllChildren(c);
        const filterOptions = document.querySelector('#attendance-filter-options');
        removeAllChildren(filterOptions);
        const contentDiv = document.querySelector('#attendance-table-block');
        const title = document.createElement('h2');
        const table = document.createElement('table');
        table.setAttribute('id', 'students-attendance-list');
        contentDiv.appendChild(title);
        contentDiv.appendChild(table);
        const namesRow = document.createElement('tr');
        table.appendChild(namesRow);
        const selectionCol = document.createElement('th');
        const selectionColText = document.createTextNode('select');
        selectionCol.appendChild(selectionColText);
        namesRow.appendChild(selectionCol);
        for (key in data[0])
        {
            const option = document.createElement('option');
            option.setAttribute('value', key);
            const optionText = document.createTextNode(key);
            option.appendChild(optionText)
            filterOptions.appendChild(option);
            const column = document.createElement('th');
            const colValue = document.createTextNode(key);
            namesRow.appendChild(column);
            column.appendChild(colValue);
        }
        for(d of data)
        {
            const tableRow = document.createElement('tr');
            table.appendChild(tableRow);
            const btn = document.createElement('input');
            btn.setAttribute('type', 'radio');
            btn.setAttribute('name', 'student-selection');
            btn.setAttribute('value', d['id']);
            tableRow.appendChild(btn);
            for(key in d)
            {
                const rowCol = document.createElement('th');
                rowCol.setAttribute('class', key)
                colValue = document.createTextNode(d[key]);
                tableRow.appendChild(rowCol);
                rowCol.appendChild(colValue);
            }
        }
    })
}
function radioButtonIsChecked()
{
    let radioBtns = document.querySelectorAll('input[type=radio]');
    for (let radio of radioBtns)
    {
        if (radio.checked === true)
            return true;
    }
    return false;
}
function checkRadioButtonSelectedShowModifyBtn()
{
    const modifyStudentAttendanceButton = document.querySelector('#modify-student-attendance-btn');
    showElementOnCondition(radioButtonIsChecked(), modifyStudentAttendanceButton);
}
function showModifyStudentAttendanceForm()
{
    const modifyStudentAttendanceForm = document.querySelector('form[name=modify_student_attendance]')
    modifyStudentAttendanceForm.classList.remove('hidden');
    let radioButtons = document.querySelectorAll('input[type=radio]');
    for (r of radioButtons)
    {
        if (r.checked === true)
            checkedRow = r.parentElement;
    }
    modifyStudentAttendanceForm.student_modify_attendance_ID.value = checkedRow.querySelector('.id').textContent;
    modifyStudentAttendanceForm.student_modify_attendance_date.value = checkedRow.querySelector('.data').textContent;
}
function handleModifyStudentAttendanceSubmission(event)
{
    event.preventDefault();
    if (
        !dateValid(event.target.student_modify_attendance_date.value) ||
        (event.target.student_modify_attendance_value.value !== "P" && event.target.student_modify_attendance_value.value !== "A")
        )
    {
        alert('FIELDS EMPTY OR WRONG');
    }
    else 
    {
        postStudentModifyAttendanceData(event.target).then((data) => {
            updateFeedbackMessageSpanContent('teacher-students-attendance-record-block', data);
        });
    }    
}
document.querySelector('#attendance-rows-filter-bar').addEventListener('keyup', handleSearch);
const modifyStudentAttendanceButton = document.querySelector('#modify-student-attendance-btn');
modifyStudentAttendanceButton.classList.add('hidden');
modifyStudentAttendanceButton.addEventListener('click', showModifyStudentAttendanceForm);
const modifyStudentAttendance = document.forms['modify_student_attendance'];
modifyStudentAttendance.classList.add('hidden');
modifyStudentAttendance.addEventListener('submit', handleModifyStudentAttendanceSubmission);