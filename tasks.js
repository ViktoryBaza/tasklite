const input = document.querySelector(".form-add__input");
const addButton = document.querySelector(".form-add__button");
const container = document.querySelector(".tasks");

const searchInput = document.querySelector(".toolbar__search");
const footer = document.querySelector(".footer-controls");
const sortSelect = document.querySelector(".toolbar__sort");
const tabButtons = document.querySelectorAll(".tabs__item");

const clearButton = document.querySelector('.footer-controls__clear'); 


const form = document.querySelector(".form-add");

let tasks = JSON.parse(localStorage.getItem('tasks')) || []; 
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));  
} 

form.addEventListener("submit", (event) => {
  event.preventDefault();
  addTask();
});

clearButton.addEventListener('click', () => {
  tasks = tasks.filter(task => !task.done);
  saveTasks();  
  renderAll();
});
function updateCounters() {
  const total = tasks.length;
  const active = tasks.filter(t => !t.done).length;
  const done = tasks.filter(t => t.done).length;
  clearButton.disabled = tasks.every(task => !task.done);  
  const counters = document.querySelector('.footer-controls__counters');
  if (counters) {
    counters.innerHTML = `
      <span>Всего: ${total}</span>
      <span>Активных: ${active}</span>
      <span>Выполненных: ${done}</span>
    `;
  }
}

function addTask() {
  const text = input.value.trim();
  if (text === "" || text.length < 3) {
    input.classList.add("input--error");
    return;
  }
  input.classList.remove("input--error");
  const newTask = {
    id: tasks.length + 1,
    text,
    done: false,
    date: formatDate(new Date()),
  };
  tasks.push(newTask);
  saveTasks();
  renderAll();
  input.value = "";
}

function renderTask(taskData) {
  const item = document.createElement("div");
  item.classList.add("task");
  const content = document.createElement("div");
  content.classList.add("task__content");
  item.append(content);

  if (taskData.done) item.classList.add("task--done");
  const title = document.createElement("div");
  title.classList.add("task__title");
  title.textContent = taskData.text;

  const meta = document.createElement("div");
  meta.classList.add("task__meta");
  meta.textContent = taskData.date;

  content.append(title, meta);

  const actions = document.createElement("div");
  actions.classList.add("task__actions");

  const editBtn = document.createElement("button");
  editBtn.classList.add("task__action", "task__action--edit");
  editBtn.title = "Редактировать";
  editBtn.innerHTML = `
      <svg
              class="task__icon"
              viewBox="0 0 24 24"
              width="14"
              height="14"
              fill="none"
              stroke="#6f64a3"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M12 20h9" />
              <path
                d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"
              />
            </svg>
    `;
  editBtn.addEventListener("click", () => {
    const newText = prompt("Изменить задачу:", taskData.text);
    if (newText && newText.trim() !== "") {
      taskData.text = newText.trim();
      saveTasks();   
      renderAll();
    }
  });
  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("task__action", "task__action-delete");
  deleteBtn.title = "Удалить";
  deleteBtn.innerHTML = `
    <svg
              class="task__icon"
              viewBox="0 0 24 24"
              width="14 "
              height="14"
              fill="none"
              stroke="#cb6e6e"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6" />
              <path d="M14 11v6" />
              <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
            </svg>
    `;
  deleteBtn.addEventListener("click", () => {
    const index = tasks.indexOf(taskData);
    tasks.splice(index, 1);
    saveTasks();    
    renderAll();
  });

  item.addEventListener("click", (e) => {
    if (e.target.closest(".task__action")) return;
    taskData.done = !taskData.done;
    saveTasks();    
    renderAll();
  });
  actions.append(editBtn, deleteBtn);
  item.append(actions);
  return item;
}
let sortOrder = 'new';
sortSelect.addEventListener('change', () => {
  const val = sortSelect.value;
  if (val.includes('новые')) sortOrder = 'new';
  else if (val.includes('старые')) sortOrder = 'old';
  else if (val.includes('A→Z')) sortOrder = 'az';
  else if (val.includes('Z→A')) sortOrder = 'za';
  renderAll();
});

let currentFilter = "all";

tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    tabButtons.forEach((b) => b.classList.remove("tabs__item--active"));
    btn.classList.add("tabs__item--active");
    if (btn.textContent.includes("Активные")) currentFilter = "active";
    else if (btn.textContent.includes("Заверш")) currentFilter = "done";
    else currentFilter = "all";
    renderAll();
  });
});



function renderAll() {
  document.querySelectorAll(".task").forEach((t) => t.remove());
  let filtered = tasks.filter((task) => {
    if (currentFilter === "active") return !task.done;
    if (currentFilter === "done") return task.done;
    return true;
  });
  const query = searchInput.value.trim().toLowerCase();
  if (query) {
    filtered = filtered.filter((task) =>
      task.text.toLowerCase().includes(query),
    );
  }
  searchInput.addEventListener("input", renderAll);
  const sortedTasks = [...filtered].sort((a, b) => {
    if (sortOrder === "new") return b.id - a.id;
    if (sortOrder === "old") return a.id - b.id;
    if (sortOrder === "az") return a.text > b.text ? 1 : -1;
    if (sortOrder === "za") return a.text < b.text ? 1 : -1;
  });
  sortedTasks.forEach((task) => footer.before(renderTask(task)));
  updateCounters();
}
renderAll();


const now = new Date();
console.log(now);

const day = now.getDate();
const month = now.getMonth() + 1;
const year = now.getFullYear();
console.log(`${day}.${month}.${year}`);

const hours = now.getHours();
const minutes = now.getMinutes();
const seconds = now.getSeconds();
console.log(`${hours}:${minutes}:${seconds}`);

console.log(now.toLocaleString());

function formatDate(date) {
  const d = date.getDate().toString().padStart(2, "0");
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const y = date.getFullYear();
  const h = date.getHours().toString().padStart(2, "0");
  const min = date.getMinutes().toString().padStart(2, "0");
  return `${d}.${m}.${y}, ${h}:${min}`;
}







