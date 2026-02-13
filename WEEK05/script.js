
let taskdata = {};
let dragelem = null;

//DOM REFERENCES
 
const todo = document.querySelector("#todo");
const progress = document.querySelector("#progress");
const done = document.querySelector("#done");

const boxes = document.querySelectorAll(".box");

const taskaddbtn = document.querySelector("nav button");
const taskpage = document.querySelector("section");
const taskpagebg = document.querySelector("section .bg");
const taskbutton = document.querySelector("section .modal button");

const columns = [todo, progress, done];

// LOAD TASKS FROM LOCAL STORAGE
 
if (localStorage.getItem("tasks")) {
  const data = JSON.parse(localStorage.getItem("tasks"));

  for (const col in data) {
    const column = document.querySelector(`#${col}`);

    data[col].forEach(task => {
      createTask(task.title, task.description, column);
    });
  }

  updateCountAndStorage();
}

// CREATE TASK FUNCTION

function createTask(title, description, column) {
  const task = document.createElement("div");
  task.classList.add("task");
  task.setAttribute("draggable", "true");

  const h3 = document.createElement("h3");
  const p = document.createElement("p");
  const button = document.createElement("button");

  h3.textContent = title;
  p.textContent = description;
  button.textContent = "Delete";
  button.classList.add("task-button");

  task.append(h3, p, button);

  /* Drag Events */
  task.addEventListener("dragstart", () => dragelem = task);
  task.addEventListener("dragend", () => dragelem = null);

  /* Delete Task */
  button.addEventListener("click", () => {
    task.remove();
    updateCountAndStorage();
  });

  column.appendChild(task);
}


//UPDATE COUNT + SAVE TO LOCAL STORAGE

function updateCountAndStorage() {
  columns.forEach(col => {
    const tasks = col.querySelectorAll(".task");
    col.querySelector(".heading h3 span").textContent = tasks.length;

    taskdata[col.id] = Array.from(tasks).map(task => ({
      title: task.querySelector("h3").innerText,
      description: task.querySelector("p").innerText
    }));
  });

  localStorage.setItem("tasks", JSON.stringify(taskdata));
}

// DRAG & DROP FOR COLUMNS
 
boxes.forEach(box => {
  box.addEventListener("dragover", e => e.preventDefault());

  box.addEventListener("dragenter", () => box.classList.add("draghover"));
  box.addEventListener("dragleave", () => box.classList.remove("draghover"));

  box.addEventListener("drop", e => {
    e.preventDefault();
    if (dragelem) box.appendChild(dragelem);
    box.classList.remove("draghover");
    updateCountAndStorage();
  });
});

 // OPEN / CLOSE MODAL

taskaddbtn.addEventListener("click", () => {
  taskpage.classList.toggle("active");
});

taskpagebg.addEventListener("click", () => {
  taskpage.classList.toggle("active");
});


 // ADD NEW TASK

taskbutton.addEventListener("click", () => {
  const tasktitle = document.querySelector("#taskinput");
  const taskdesc = document.querySelector("#tasktextarea");

  if (!tasktitle.value.trim() || !taskdesc.value.trim()) {
    alert("Please fill all fields");
    return;
  }

  createTask(tasktitle.value, taskdesc.value, todo);

  tasktitle.value = "";
  taskdesc.value = "";

  updateCountAndStorage();
  taskpage.classList.toggle("active");
});
