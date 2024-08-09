let mainStatus = document.getElementById("status");
let mainList = document.getElementById("main-list");
let completedList = document.getElementById("completed-list");
let addInput = document.getElementById("add-input");
let addButton = document.getElementById("add-button");
let confirmScreen = document.querySelector(".confirm-screen");

let confirmTaskText = document.querySelector(".confirm-task-text");
let confirmButton = document.getElementById("confirm");
let cancelButton = document.getElementById("cancel");
let taskText,
  taskTextSpan,
  checkButton,
  editButton,
  deleteButton,
  buttonsContainer,
  task,
  taskArray = [],
  isEditing = false;

addButton.onclick = buttonClick;

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
  deleteButtonTemp = this;
  confirmScreen.style.display = "grid";

  confirmTaskText.innerText = `'${
    deleteButtonTemp.parentElement.parentElement.querySelector("span").innerText
  }'`;
  confirmButton.onclick = function () {
    taskArray.forEach((task) => {
      if (
        task.taskText ==
        deleteButtonTemp.parentElement.parentElement.querySelector("span")
          .innerText
      ) {
        taskArray.splice(taskArray.indexOf(task), 1);
        return;
      }
    });
    localStorage.setItem("tasks", JSON.stringify(taskArray));
    deleteButtonTemp.parentElement.parentElement.remove();
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
    if (
      addInput.value.split("  ").join("") == " " ||
      addInput.value.split("  ").join("") == ""
    ) {
      editButtonTemp.nextSibling.click();
    } else {
      for (let i = 0; i < taskArray.length; i++) {
        if (
          taskArray[i].taskText ==
          editButtonTemp.parentElement.parentElement.querySelector("span")
            .innerText
        ) {
          editButtonTemp.parentElement.parentElement.querySelector(
            "span"
          ).innerText = addInput.value;
          taskArray[i].taskText =
            editButtonTemp.parentElement.parentElement.querySelector(
              "span"
            ).innerText;
          break;
        }
      }
      editButtonTemp.parentElement.parentElement.querySelector(
        "span"
      ).innerText = addInput.value;
      localStorage.setItem("tasks", JSON.stringify(taskArray));
      updateStatus();
    }
    addInput.value = "";
    addButton.onclick = buttonClick;
    addButton.classList = "fa-solid fa-plus";
  };
}

function addTask(taskText, isCompleted) {
  taskTextSpan = document.createElement("span");
  taskTextSpan.classList.add("task-text");
  checkButton = document.createElement("button");
  checkButton.onmousedown = buttonCheck;
  if (!isCompleted) checkButton.classList.add("fa-solid", "fa-check");
  else checkButton.classList.add("fa-solid", "fa-arrow-up");

  editButton = document.createElement("button");
  editButton.classList.add("fa-solid", "fa-pencil");
  editButton.onclick = buttonEdit;

  deleteButton = document.createElement("button");
  deleteButton.classList.add("fa-solid", "fa-trash");
  deleteButton.onclick = buttonDelete;
  buttonsContainer = document.createElement("div");
  buttonsContainer.classList.add("task-buttons");
  buttonsContainer.append(checkButton);
  buttonsContainer.append(editButton);
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
    task.taskText = removeSpaces(task.taskText);
    addTask(task.taskText, task.isCompleted);
  });
  localStorage.setItem("tasks", JSON.stringify(taskArray));
}
updateStatus();

addInput.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    addButton.click();
  }
});
function buttonClick() {
  if (removeSpaces(addInput.value) == "") {
    mainStatus.innerHTML = "Please enter a task.";
    setTimeout(updateStatus, 1500);
    return;
  }
  mainStatus.innerHTML = "";

  addTask(addInput.value, false);
  if (taskArray)
    taskArray.push({ taskText: removeSpaces(addInput.value), isCompleted: false });
  else taskArray = [{ taskText: removeSpaces(addInput.value), isCompleted: false }];
  localStorage.setItem("tasks", JSON.stringify(taskArray));
  updateStatus();
  addInput.value = "";
}

function removeSpaces(str) {
  // This line of code uses a regular expression with the global ("g") and case-insensitive ("i") flags to replace all occurrences of one or more whitespace characters with a single space character. It then trims any leading or trailing whitespace from the resulting string.
  // 
  // The regular expression /\s+/g matches one or more whitespace characters (such as spaces, tabs, or line breaks) in the string. The "g" flag makes the regular expression global, so it matches all occurrences in the string, not just the first one.
  // 
  // The replace() method is then called on the string with the regular expression and a replacement string. In this case, the replacement string is a single space character.
  // 
  // The trim() method is then called on the resulting string to remove any leading or trailing whitespace.
  // 
  // The resulting string is the original string with all consecutive whitespace characters replaced by a single space character, and any leading or trailing whitespace removed.
  return str.replace(/\s+/g,' ').trim();
}
