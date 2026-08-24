function addTask() {
    let input = document.getElementById("taskInput");
    let priorityInput = document.getElementById("priorityInput");

    let task = input.value;
    let priority = priorityInput.value;

    if (task === "") {
        alert("Please enter a task");
        return;
    }

    let li = document.createElement("li");

    li.textContent = task + " - " + priority + " Priority";

    if (priority === "High") {
        li.classList.add("high-priority");
    } else if (priority === "Medium") {
        li.classList.add("medium-priority");
    } else {
        li.classList.add("low-priority");
    }

    document.getElementById("taskList").appendChild(li);

    input.value = "";
}