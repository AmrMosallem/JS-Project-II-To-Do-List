let mainStatus = document.getElementById("status");
let mainList = document.getElementById("main-list");
let completedList = document.getElementById("completed-list");
let addInput = document.getElementById("add-input");
let addButton = document.getElementById("add-button");
let search = document.getElementById("search");
let confirmScreen = document.querySelector(".confirm-screen");
let confirmTaskText = document.querySelector(".confirm-task-text");
let confirmButton = document.getElementById("confirm");
let cancelButton = document.getElementById("cancel");

function saveToLocalStorage() {
  let taskArray = [];
  document.querySelectorAll(".task").forEach((task) => {
    taskArray.push({
      taskText: task.querySelector("span").innerText,
      isCompleted: task.classList.contains("completed-task"),
    });
  });
  localStorage.setItem("tasks", JSON.stringify(taskArray));
}
function buttonClick() {
  if (removeSpaces(addInput.value) == "") {
    mainStatus.innerHTML = "Please enter a task.";
    setTimeout(updateStatus, 1500);
    return;
  }
  mainStatus.innerHTML = "";

  addTask(removeSpaces(addInput.value), false);
  saveToLocalStorage();
  updateStatus();
  addInput.value = "";
}
function buttonCheck() {
  if (this.classList.contains("fa-check")) {
    completedList.append(this.parentElement.parentElement);
    this.parentElement.parentElement.classList.add("completed-task");
    this.classList = "fa-solid fa-arrow-up";
  } else {
    mainList.append(this.parentElement.parentElement);
    this.parentElement.parentElement.classList.remove("completed-task");
    this.classList = "fa-solid fa-check";
  }
  saveToLocalStorage();
  updateStatus();
}
function buttonDelete() {
  deleteButtonTemp = this;
  confirmScreen.style.display = "grid";

  confirmTaskText.innerText = `'${
    deleteButtonTemp.parentElement.parentElement.querySelector("span").innerText
  }'`;
  confirmButton.onclick = function () {
    deleteButtonTemp.parentElement.parentElement.remove();
    saveToLocalStorage();
    confirmScreen.style.display = "none";
    mainStatus.innerHTML = "Task Deleted";
    setTimeout(updateStatus, 2000);
  };
  cancelButton.onclick = function () {
    confirmScreen.style.display = "none";
  };
}
function buttonEdit() {
  addButton.classList = "fa-solid fa-check";
  addInput.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });
  addInput.focus();
  addInput.value =
    this.parentElement.parentElement.querySelector("span").innerText;
  editButtonTemp = this;
  mainStatus.innerHTML = `Editing: <strong>${
    this.parentElement.parentElement.querySelector("span").innerText
  } </strong>`;
  addButton.onclick = function () {
    if (removeSpaces(addInput.value) == "") {
      editButtonTemp.nextSibling.click();
      updateStatus();
    } else {
      editButtonTemp.parentElement.parentElement.querySelector(
        "span"
      ).innerText = addInput.value;
      saveToLocalStorage();
      updateStatus();
    }
    addInput.value = "";
    addButton.onclick = buttonClick;
    addButton.classList = "fa-solid fa-plus";
  };
}
function addTask(taskText, isCompleted) {
  let taskTextSpan = document.createElement("span");
  taskTextSpan.classList.add("task-text");
  let checkButton = document.createElement("button");
  checkButton.onmousedown = buttonCheck;
  if (!isCompleted) checkButton.classList.add("fa-solid", "fa-check");
  else checkButton.classList.add("fa-solid", "fa-arrow-up");

  let editButton = document.createElement("button");
  editButton.classList.add("fa-solid", "fa-pencil");
  editButton.onclick = buttonEdit;
  let deleteButton = document.createElement("button");
  deleteButton.classList.add("fa-solid", "fa-trash");
  deleteButton.onclick = buttonDelete;
  let buttonsContainer = document.createElement("div");
  buttonsContainer.classList.add("task-buttons");
  buttonsContainer.append(checkButton);
  buttonsContainer.append(editButton);
  buttonsContainer.append(deleteButton);

  let task = document.createElement("div");
  task.classList.add("task");
  if (isCompleted) task.classList.add("completed-task");
  taskTextSpan.innerText = taskText;
  task.append(taskTextSpan);
  task.append(buttonsContainer);
  if (!isCompleted) mainList.append(task);
  else completedList.append(task);
}
function countCompletedTasks() {
  let taskArray = JSON.parse(localStorage.getItem("tasks"));
  if (!taskArray.length) return 0;
  let count = 0;

  taskArray.forEach((task) => {
    if (task.isCompleted) count++;
  });
  return count;
}
function updateStatus() {
  let taskArray = JSON.parse(localStorage.getItem("tasks"));
  if (!taskArray.length) mainStatus.innerHTML = "No tasks added.";
  else if (taskArray.length - countCompletedTasks() == 0)
    mainStatus.innerHTML = "All tasks completed.";
  else
    mainStatus.innerHTML = `${countCompletedTasks()} out of ${
      taskArray.length
    } tasks completed.`;
}
function removeSpaces(str) {
  return str.replace(/\s+/g, " ").trim();
}
if (localStorage.tasks) {
  JSON.parse(localStorage.getItem("tasks")).forEach((task) => {
    task.taskText = removeSpaces(task.taskText);
    addTask(task.taskText, task.isCompleted);
  });
}
updateStatus();
addButton.onclick = buttonClick;
addInput.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    addButton.click();
  }
});
search.addEventListener("input", function () {
  let value = search.value;
  let re = new RegExp(value, "gi");
  document.querySelectorAll(".task").forEach((task) => {
    let text = task.querySelector("span").innerText;
    if (text.match(re)) {
      task.style.display = "block";
    } else {
      task.style.display = "none";
    }
  });
});