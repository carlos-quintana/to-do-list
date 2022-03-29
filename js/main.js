const form = document.querySelector("#new-task-form");
const tasksList = document.querySelector("#tasks-list");

// new-task-form is submitted
form.addEventListener("submit", event => {
    event.preventDefault();
    console.log("The New Task Form was submitted")
    submitTask(event)
})

// Validate, sanitize and submit the task
function submitTask() {
    let taskDescriptionInput = retrieveTaskInput();
    taskDescriptionInput = taskDescriptionInput.trim();
    if (isInputEmpty(taskDescriptionInput)) {
        alert("The new task cannot be empty");
        console.log("The task submitted was invalid");
    } else {
        addTask(taskDescriptionInput);
        resetNewTaskForm();
        console.log(`The task "${taskDescriptionInput}" was submitted successfully`);
    }
}

function retrieveTaskInput() {
    return document.querySelector("#new-task-description").value
}

function isInputEmpty(input) {
    return input === "";
}

function addTask(taskDescription) {
    const newRow = document.createElement("li");
    newRow.className = "task-row";
    console.log(tasksList)

    const newDescription = document.createElement("span");
    newDescription.innerText = taskDescription;
    newDescription.className = "task-name";

    const newDeleteButton = document.createElement("button")
    newDeleteButton.className = "delete-button"
    newDeleteButton.innerText = "X"

    newRow.appendChild(newDescription);
    newRow.appendChild(newDeleteButton);

    tasksList.appendChild(newRow);
}

// Empties the form textbox 
function resetNewTaskForm() {
    document.querySelector("#new-task-description").value = "";
}

// When the user clicks on the list of tasks, this function will check
// which element in the DOM it triggered and act accordingly.
tasksList.addEventListener("click", event => {
    console.log("User clicked on the list", event.target)
    if (event.target.className == "delete-button"){
        console.log("User clicked on a delete button")
        deleteTask(event.target)
    }
})

function deleteTask(target) {
    console.log("Removing task", target.parentElement)
    const row = target.parentElement
    row.parentElement.removeChild(row)
}