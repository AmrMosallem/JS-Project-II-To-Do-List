let mainStatus = document.getElementById("status");
let mainList = document.getElementById("main-list");
let completedList = document.getElementById("completed-list");
let addInput = document.getElementById("add-input");
let addButton = document.getElementById("add-button");

let taskText,
  taskTextSpan,
  checkButton,
  deleteButton,
  buttonsContainer,
  task,
  taskArray = [];

function buttonCheck() {
  if (this.classList.contains("fa-check")) {
    completedList.append(this.parentElement.parentElement);
    this.parentElement.parentElement.classList.add("completed-task");
    this.parentElement.parentElement.classList.remove("task");
    this.classList.remove("fa-check");
    this.classList.add("fa-arrow-up");
    for (let i = 0; i < taskArray.length; i++) {
      if (
        taskArray[i].taskText ==
          this.parentElement.parentElement.querySelector("span").innerText &&
        !taskArray[i].isCompleted
      ) {
        taskArray[i].isCompleted = true;
        break;
      }
    }
  } else {
    mainList.append(this.parentElement.parentElement);
    this.parentElement.parentElement.classList.add("task");
    this.parentElement.parentElement.classList.remove("completed-task");
    this.classList.remove("fa-arrow-up");
    this.classList.add("fa-check");

    for (let i = 0; i < taskArray.length; i++) {
      if (
        taskArray[i].taskText ==
          this.parentElement.parentElement.querySelector("span").innerText &&
        taskArray[i].isCompleted
      ) {
        taskArray[i].isCompleted = false;
        break;
      }
    }
  }

  localStorage.setItem("tasks", JSON.stringify(taskArray));
  updateStatus();
}
function buttonDelete() {
  taskArray.forEach((task) => {
    if (
      task.taskText ==
      this.parentElement.parentElement.querySelector("span").innerText
    ) {
      taskArray.splice(taskArray.indexOf(task), 1);
      return;
    }
  });
  localStorage.setItem("tasks", JSON.stringify(taskArray));
  this.parentElement.parentElement.remove();
  updateStatus();
}

function addTask(taskText, isCompleted) {
  taskTextSpan = document.createElement("span");
  taskTextSpan.classList.add("task-text");
  checkButton = document.createElement("i");
  checkButton.onclick = buttonCheck;
  if (!isCompleted) checkButton.classList.add("fa-solid", "fa-check");
  else checkButton.classList.add("fa-solid", "fa-arrow-up");

  deleteButton = document.createElement("i");
  deleteButton.classList.add("fa-solid", "fa-trash");
  deleteButton.onclick = buttonDelete;
  buttonsContainer = document.createElement("div");
  buttonsContainer.classList.add("task-buttons");
  buttonsContainer.append(checkButton);
  buttonsContainer.append(deleteButton);

  task = document.createElement("div");
  if (!isCompleted) task.classList.add("task");
  else task.classList.add("completed-task");
  taskTextSpan.innerText = taskText;
  task.append(taskTextSpan);
  task.append(buttonsContainer);
  if (!isCompleted) mainList.append(task);
  else completedList.append(task);
}
function countUncompletedTasks() {
  return taskArray.length - countCompletedTasks();
}
function countCompletedTasks() {
  if (!taskArray.length) return 0;
  let count = 0;

  taskArray.forEach((task) => {
    if (task.isCompleted) count++;
  });
  return count;
}
function updateStatus() {
  if (!taskArray.length) mainStatus.innerHTML = "No tasks added.";
  else if (countUncompletedTasks() == 0)
    mainStatus.innerHTML = "All tasks completed.";
  else
    mainStatus.innerHTML = `${countCompletedTasks()} out of ${
      taskArray.length
    } tasks completed.`;
}

if (localStorage.tasks) {
  taskArray = JSON.parse(localStorage.getItem("tasks"));
  taskArray.forEach((task) => {
    addTask(task.taskText, task.isCompleted);
  });
}
updateStatus();

addInput.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    addButton.click();
  }
});

addButton.onclick = function () {
  if (addInput.value == "") {
    mainStatus.innerHTML = "Please enter a task.";
    setTimeout(updateStatus,1500)
    return;
  }
  mainStatus.innerHTML = "";

  addTask(addInput.value, false);
  if (taskArray)
    taskArray.push({ taskText: taskTextSpan.innerText, isCompleted: false });
  else taskArray = [{ taskText: taskTextSpan.innerText, isCompleted: false }];
  localStorage.setItem("tasks", JSON.stringify(taskArray));
  updateStatus();
  addInput.value = "";
};
