function postWorkerData(formData)
{
    return fetch('worker-addition', {
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json, text-plain, */*",
        "X-Requested-With": "XMLHttpRequest",
        "X-CSRF-TOKEN": token
    },
    method: 'POST',
    credentials: "same-origin",
    body: JSON.stringify({
        cf: formData.cf.value,
        email: formData.email.value,
        name: formData.name.value,
        surname: formData.surname.value,
        date: formData.date.value,
        sex: formData.sex.value,
        role: formData.role.value,
        beginning_date: formData.beginning_date.value,
        profile_img: formData.profile_img.value
    }),
    })    
    .then(onResponse)
    .then(onJSON)
    .catch(onError);
}
function handleWorkerSubmission(event)
{
    event.preventDefault();
    if (
        !cfValid(event.target.cf.value) || 
        !nameValid(event.target.name.value) ||
        !surnameValid(event.target.surname.value) ||
        !emailValid(event.target.email.value) ||
        !dateValid(event.target.date.value)
        )
    {
        alert('FIELDS EMPTY OR WRONG');
    }
    else if (mailAlreadyTaken)
    {
        alert('EMAIL gia\' utilizzata!');
    }
    else if (cfAlreadyTaken)
    {
        alert('Codice Fiscale gia\' utilizzato!');
    }
    else 
    {
        postWorkerData(event.target).then((data) => {
            updateFeedbackMessageSpanContent('add-worker-form-block', data);
        });
    }    
}
function addListenersAddWorkerForm ()
{
    const addWorkerForm = document.querySelector('form[name=add_worker]')
    addWorkerForm.addEventListener('submit', handleWorkerSubmission);
        
    const cfInputField = addWorkerForm.cf;
    cfInputField.addEventListener('keyup', handleCfInput);
    
    const nameInputField = addWorkerForm.name;
    nameInputField.addEventListener('keyup', handleNameInput);
    
    const surnameInputField = addWorkerForm.surname;
    surnameInputField.addEventListener('keyup', handleSurnameInput);
    
    const emailInputField = addWorkerForm.email;
    emailInputField.addEventListener('keyup', handleEmailInput);
    
    const dateInputField = addWorkerForm.date;
    dateInputField.addEventListener('change', handleDateInput);

    const beginningDateInputField = addWorkerForm.beginning_date;
    beginningDateInputField.addEventListener('change', handleBeginningDateInput);
}
