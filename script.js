let tasks = [];

function addTask() {
    const input = document.getElementById("taskInput");
    const priorityInput = document.getElementById("priorityInput");

    const taskText = input.value.trim();
    const priority = priorityInput ? priorityInput.value : "Low";

    if (taskText === "") {
        alert("Please enter a task");
        return;
    }

    tasks.push({
        text: taskText,
        priority: priority,
        completed: false
    });

    input.value = "";
    displayTasks();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    displayTasks();
}

function completeTask(index) {
    tasks[index].completed = !tasks[index].completed;
    displayTasks();
}

function displayTasks() {
    const list = document.getElementById("taskList");
    list.innerHTML = "";

    tasks.forEach((task, index) => {
        const li = document.createElement("li");

        li.innerHTML = `
            <span class="${task.completed ? "completed" : ""}">
                ${task.text} - ${task.priority} Priority
            </span>

            <button onclick="completeTask(${index})">
                ${task.completed ? "Undo" : "Complete"}
            </button>

            <button onclick="deleteTask(${index})">
                Delete
            </button>
        `;

        if (task.priority === "High") {
            li.classList.add("high-priority");
        } else if (task.priority === "Medium") {
            li.classList.add("medium-priority");
        } else {
            li.classList.add("low-priority");
        }

        list.appendChild(li);
    });

    updateDashboard();
}

function updateDashboard() {
    const totalTasks = document.getElementById("totalTasks");
    const completedTasks = document.getElementById("completedTasks");
    const pendingTasks = document.getElementById("pendingTasks");

    if (totalTasks) {
        totalTasks.textContent = tasks.length;
    }

    const completed = tasks.filter(task => task.completed).length;

    if (completedTasks) {
        completedTasks.textContent = completed;
    }

    if (pendingTasks) {
        pendingTasks.textContent = tasks.length - completed;
    }
}