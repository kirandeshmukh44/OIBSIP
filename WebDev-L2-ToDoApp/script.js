let taskInput = document.getElementById("taskInput");
let addTaskButton = document.getElementById("addTaskButton");

let pendingList = document.getElementById("pendingList");
let completedList = document.getElementById("completedList");

let pendingCount = document.getElementById("pendingCount");
let completedCount = document.getElementById("completedCount");

let pendingEmpty = document.getElementById("pendingEmpty");
let completedEmpty = document.getElementById("completedEmpty");


// Get saved tasks from localStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];


// Display tasks when page loads
displayTasks();


// Add Task
addTaskButton.addEventListener("click", addTask);


// Add task using Enter key
taskInput.addEventListener("keypress", function(event) {

    if (event.key === "Enter") {
        addTask();
    }

});


function addTask() {

    let taskText = taskInput.value.trim();

    // Don't add empty task
    if (taskText === "") {

        alert("Please enter a task.");

        return;
    }


    let newTask = {

        id: Date.now(),

        text: taskText,

        completed: false,

        createdAt: new Date().toLocaleString(),

        completedAt: ""

    };


    tasks.push(newTask);


    saveTasks();

    displayTasks();


    taskInput.value = "";

    taskInput.focus();

}


// Display Tasks
function displayTasks() {

    pendingList.innerHTML = "";

    completedList.innerHTML = "";


    let pendingTasks = tasks.filter(function(task) {
        return task.completed === false;
    });


    let completedTasks = tasks.filter(function(task) {
        return task.completed === true;
    });


    // Display pending tasks
    pendingTasks.forEach(function(task) {

        let taskElement = createTaskElement(task);

        pendingList.appendChild(taskElement);

    });


    // Display completed tasks
    completedTasks.forEach(function(task) {

        let taskElement = createTaskElement(task);

        completedList.appendChild(taskElement);

    });


    // Update counts
    pendingCount.textContent =
        pendingTasks.length + " pending";


    completedCount.textContent =
        completedTasks.length + " completed";


    // Empty messages
    if (pendingTasks.length === 0) {

        pendingEmpty.style.display = "block";

    }
    else {

        pendingEmpty.style.display = "none";

    }


    if (completedTasks.length === 0) {

        completedEmpty.style.display = "block";

    }
    else {

        completedEmpty.style.display = "none";

    }

}


// Create task element
function createTaskElement(task) {

    let li = document.createElement("li");

    li.className = "task";


    if (task.completed) {

        li.classList.add("completed");

    }


    // Task text
    let taskTextDiv = document.createElement("div");

    taskTextDiv.className = "task-text";


    let text = document.createElement("span");

    text.textContent = task.text;


    let time = document.createElement("small");

    time.className = "task-time";


    if (task.completed) {

        time.textContent =
            "Added: " + task.createdAt +
            " | Completed: " + task.completedAt;

    }
    else {

        time.textContent =
            "Added: " + task.createdAt;

    }


    taskTextDiv.appendChild(text);

    taskTextDiv.appendChild(time);


    // Buttons
    let buttons = document.createElement("div");

    buttons.className = "task-buttons";


    // Complete button
    if (!task.completed) {

        let completeButton =
            document.createElement("button");

        completeButton.textContent = "Complete";

        completeButton.className = "complete-btn";


        completeButton.addEventListener("click", function() {

            task.completed = true;

            task.completedAt =
                new Date().toLocaleString();

            saveTasks();

            displayTasks();

        });


        buttons.appendChild(completeButton);

    }


    // Edit button
    let editButton =
        document.createElement("button");

    editButton.textContent = "Edit";

    editButton.className = "edit-btn";


    editButton.addEventListener("click", function() {

        editTask(task, taskTextDiv, buttons);

    });


    buttons.appendChild(editButton);


    // Delete button
    let deleteButton =
        document.createElement("button");

    deleteButton.textContent = "Delete";

    deleteButton.className = "delete-btn";


    deleteButton.addEventListener("click", function() {

        deleteTask(task.id);

    });


    buttons.appendChild(deleteButton);


    li.appendChild(taskTextDiv);

    li.appendChild(buttons);


    return li;

}


// Edit Task
function editTask(task, taskTextDiv, buttons) {

    taskTextDiv.innerHTML = "";


    let editInput =
        document.createElement("input");

    editInput.type = "text";

    editInput.value = task.text;

    editInput.className = "edit-input";


    let saveButton =
        document.createElement("button");

    saveButton.textContent = "Save";

    saveButton.className = "save-btn";


    saveButton.addEventListener("click", function() {

        let newText = editInput.value.trim();


        if (newText === "") {

            alert("Task cannot be empty.");

            return;

        }


        task.text = newText;

        saveTasks();

        displayTasks();

    });


    taskTextDiv.appendChild(editInput);

    buttons.prepend(saveButton);

    editInput.focus();

}


// Delete Task
function deleteTask(id) {

    tasks = tasks.filter(function(task) {

        return task.id !== id;

    });


    saveTasks();

    displayTasks();

}


// Save tasks to localStorage
function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

}