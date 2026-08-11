function addTask() {
    const taskInput = document.getElementById("taskInput");
    const taskList = document.getElementById("taskList");

    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task.");
        return;
    }

    const li = document.createElement("li");

    li.innerHTML = `
        <span onclick="completeTask(this)">${taskText}</span>
        <div>
            <button onclick="completeTask(this.parentElement.previousElementSibling)">
                Complete
            </button>
            <button class="delete-btn" onclick="deleteTask(this)">
                Delete
            </button>
        </div>
    `;

    taskList.appendChild(li);

    taskInput.value = "";
}

function completeTask(task) {
    task.style.textDecoration = "line-through";
    task.style.color = "green";
}

function deleteTask(button) {
    button.parentElement.parentElement.remove();
}