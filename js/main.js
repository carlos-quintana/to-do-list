const form = document.querySelector("#new-task-form");
const tasksList = document.querySelector("#tasks-list");
const newTaskDescription = document.querySelector("#new-task-description");

const MAX_ID = 99999; // The integer that will top the random ID generation for the different tasks.
const MAX_ATTEMPTS = 100 // The number of attempts the program will try to generate an unique id for a task before throwing an error.

/*
Tasks have the form: 
{   id: Number,   
    description: String
}
*/
let tasks = [];

/*
 *  Task addition
 */

// new-task-form is submitted
form.addEventListener("submit", event => {
    event.preventDefault();
    console.log(" > The New Task Form was submitted");
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
    return newTaskDescription.value;
}

function isInputEmpty(input) {
    return input === "";
}

function addTask(taskDescription) {
    const newTask = {
        "id": generateID(),
        "description": taskDescription
    };
    addTaskToModel(newTask);
    addTaskToView(newTask);
}

// As this application does not have a backend, and for the sake of simplicity, it will generate it's own random unique identifiers for model manipulation
function generateID() {
    let newID;
    let attempts = 0;
    do {
        console.log("(generateID) Generating a new ID");
        newID = Math.floor(Math.random() * MAX_ID) + 1;
        console.log(`(generateID) Got the id=${newID} on the attempt ${attempts}`);
        attempts += 1;
        if (attempts > MAX_ATTEMPTS) {
            alert("Couldn't create an unique ID for the task");
            throw "(generateID) Couldn't create an unique ID for the task";
        };
    } while (!isUniqueID(newID));
    return newID;
}

function isUniqueID(id) {
    console.log(`(isUniqueID) Verifying the uniqueness of the ID ${id}`);
    return tasks.filter(task => { return task.id == id; }).length === 0;
}

function addTaskToModel(newTask) {
    console.log("Adding the task to the model");
    tasks.push(newTask);
    console.log("Current tasks:", tasks);
}

function addTaskToView(newTask) {
    const newRow = document.createElement("li");
    newRow.className = "task-row";
    // console.log(tasksList)

    const newID = document.createElement("span");
    newID.innerText = newTask.id;
    newID.className = "task-id";
    newID.hidden = false;

    const newDescription = document.createElement("span");
    newDescription.innerText = newTask.description;
    newDescription.className = "task-description";

    const newDeleteButton = document.createElement("button");
    newDeleteButton.className = "delete-button";
    newDeleteButton.innerText = "X";

    newRow.appendChild(newID);
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
    console.log("> User clicked on the tasks list", event.target);
    if (event.target.className == "delete-button") {
        console.log("User clicked on a delete button");
        const taskRow = event.target.parentElement;
        const taskID = taskRow.querySelector(".task-id").innerText;
        console.log(taskRow, taskID)
        deleteTask(taskID)
    }
})

function deleteTask(taskID) {
    deleteTaskFromModel(taskID);
    deleteTaskFromView(taskID);
}

function deleteTaskFromModel(taskID) {
    console.log(`Removing task with id ${taskID} from the model`);
    tasks = tasks.filter(task => task.id != taskID);
    console.log("Current tasks:", tasks);
}

function deleteTaskFromView(taskID) {
    console.log(`Removing task with id ${taskID} from the view`);
    const rowToDelete = getRowFromId(taskID);
    tasksList.removeChild(rowToDelete);
}

function getRowFromId(taskID) {
    console.log(`(getRowFromId) Looking for task with id ${taskID}`);
    const taskRows = [...tasksList.children];
    for (let row of taskRows) {
        if (row.querySelector(".task-id").innerText == taskID)
            return row;
    }
    return null;
}