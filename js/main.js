const form = document.querySelector("#new-task-form");
const tasksList = document.querySelector("#tasks-list");
const newTaskDescription = document.querySelector("#new-task-description")

let tasks = [];

/*
 *  Task addition
 */

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
    return newTaskDescription.value
}

function isInputEmpty(input) {
    return input === "";
}

function addTask(taskDescription) {
    addTaskToModel(taskDescription);
    addTaskToView(taskDescription);
}

function addTaskToModel(taskDescription) {
    tasks.push(taskDescription)
    console.log("Current tasks:", tasks);
}

function addTaskToView(taskDescription) {
    const newRow = document.createElement("li");
    newRow.className = "task-row";
    console.log(tasksList)

    const newDescription = document.createElement("span");
    newDescription.innerText = taskDescription;
    newDescription.className = "task-description";

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

/*
 *  Task deletion 
 */

// When the user clicks on the list of tasks, this function will check
// which element in the DOM it triggered and act accordingly.
tasksList.addEventListener("click", event => {
    console.log("User clicked on the list", event.target)
    if (event.target.className == "delete-button"){
        console.log("User clicked on a delete button")
        deleteTask(event.target)
    }
})

function deleteTask(targetElement) {
    deleteTaskFromModel(targetElement);
    deleteTaskFromView(targetElement);
}

function deleteTaskFromModel(targetElement) {
    const taskDescription = targetElement.parentElement.querySelector(".task-description").innerText
    console.log(`Removing task "${taskDescription}" from the model`)
    tasks = tasks.filter(task => task != taskDescription)
    console.log("Current tasks:", tasks);
}

function deleteTaskFromView(targetElement) {
    console.log("Removing task from view", targetElement.parentElement)
    const row = targetElement.parentElement
    row.parentElement.removeChild(row)
}