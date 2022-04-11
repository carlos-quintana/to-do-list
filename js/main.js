const form = document.querySelector("#new-task-form");
const tasksList = document.querySelector("#tasks-list");
const newTaskDescription = document.querySelector("#new-task-input");
const clearListButton = document.querySelector("#clear-list");
const clearLocalStorageButton = document.querySelector("#clear-localstorage");

const MAX_ID = 99999; // The integer that will top the random ID generation for the different tasks.
const MAX_ATTEMPTS = 100 // The number of attempts the program will try to generate an unique id for a task before throwing an error.

/*
Tasks have the form: 
{   id: Number,   
    description: String
}
*/
let tasks = [];
initializeTasks();

/*
 *  Input handling
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
        resetTaskForm();
        newTaskDescription.focus();
        console.log(`The task "${taskDescriptionInput}" was submitted successfully`);
    }
}

function retrieveTaskInput() {
    return newTaskDescription.value;
}

function isInputEmpty(input) {
    return input === "";
}

function resetTaskForm() {
    newTaskDescription.value = "";
}

/*
 *  Task addition
 */

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
        // console.log("(generateID) Generating a new ID");
        newID = Math.floor(Math.random() * MAX_ID) + 1;
        // console.log(`(generateID) Got the id=${newID} on the attempt ${attempts}`);
        attempts += 1;
        if (attempts > MAX_ATTEMPTS) {
            alert("Couldn't create an unique ID for the task");
            throw "(generateID) Couldn't create an unique ID for the task";
        };
    } while (!isUniqueID(newID));
    return newID;
}

function isUniqueID(id) {
    // console.log(`(isUniqueID) Verifying the uniqueness of the ID ${id}`);
    return tasks.filter(task => { return task.id == id; }).length === 0;
}

function addTaskToModel(newTask) {
    console.log("Adding the task to the model");
    tasks.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(tasks.map(task => task.description)));
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
    newDeleteButton.classList.add("button");
    newDeleteButton.classList.add("delete-button");
    newDeleteButton.setAttribute("data-tooltip", "Delete task");
    newDeleteButton.innerHTML = '<i class="fas fa-times"></i>';

    newRow.appendChild(newID);
    newRow.appendChild(newDescription);
    newRow.appendChild(newDeleteButton);

    tasksList.appendChild(newRow);
}

/*
 *  Task deletion 
 */

// When the user clicks on the list of tasks, this function will check
// which element in the DOM it triggered and act accordingly.
tasksList.addEventListener("click", event => {
    console.log("> User clicked on the tasks list", event.target);
    if ([...event.target.classList].includes("delete-button")) {
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
    localStorage.setItem("tasks", JSON.stringify(tasks.map(task => task.description)));
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

clearListButton.addEventListener("click", () => {
    if (tasks.length > 0) {
        openModal(
            "Warning",
            "This will delete all the current tasks, do you wanna proceed?",
            clearAllTasks);
    }
})

function clearAllTasks() {
    for (let task of tasks)
        deleteTask(task.id);
}

clearLocalStorageButton.addEventListener("click", () => {
    openModal(
        "Warning",
        "This will clear the Local Storage of your browser, deleting all your history on this application and restoring the default tasks.<br>Do you wanna proceed?",
        restoreList);

})

function restoreList() {
    localStorage.clear();
    window.location.reload();
}


/*
 *  Example tasks
 */

function getExampleTasks() {
    return [
        "Walk the dog",
        "Check emails",
        "Do the laundry",
        "Organize my desk",
        "Practice the guitar"
    ];
}

/*
 *  Initialize the tasks stored in the LocalStorage
 */

function initializeTasks() {
    console.log("(initializeTasks) Initializing Tasks");
    const storedTasks = localStorage.getItem("tasks");
    let tasks;
    if (storedTasks === null) { // First time user is visiting, fill with example tasks
        console.log("Stored Tasks was null")
        tasks = getExampleTasks();
    } else { // Get all the existing tasks from localStorage
        console.log("Stored Tasks was not null, returned:", storedTasks)
        tasks = JSON.parse(storedTasks);
    }
    for (let task of tasks)
        addTask(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    return tasks;
}

/*
 *  Modal management
 */

function openModal(title = "", body = "", buttonFunction = undefined) {
    console.log("Inside open modal")
    if (!buttonFunction) return;

    // Make the modal visible
    const modalBackground = document.querySelector("#modal-backdrop");
    modalBackground.style.opacity = "100%";
    modalBackground.style.visibility = "visible";

    // Retrieve all the modal text elements and insert the text
    const modalTitle = document.querySelector("#modal-title");
    const modalBody = document.querySelector("#modal-body");
    modalTitle.innerHTML = title;
    modalBody.innerHTML = body;

    // Retrieve the buttons and assign their event listeners
    const modalCloseButton = document.querySelector("#modal-close");
    const modalCancelButton = document.querySelector("#modal-cancel");
    const modalOkButton = document.querySelector("#modal-button");
    modalCloseButton.addEventListener("click", closeModal);
    modalCancelButton.addEventListener("click", closeModal);
    modalOkButton.addEventListener("click", () => {
        buttonFunction();
        closeModal();
    });
}

function closeModal() {
    console.log("Close the modal")
    const modalBackground = document.querySelector("#modal-backdrop");
    modalBackground.style.opacity = "0%";
    setTimeout(() => {
        modalBackground.style.visibility = "hidden";
    }, 200);
}

