// Урок 38
const columns = document.querySelectorAll(".column");

let boardData = JSON.parse(localStorage.getItem("kanbanData")) || {
  todo: [],
  "in-progress": [],
  done: [],
};

function renderBoard() {
  columns.forEach((column) => {
    const status = column.dataset.status;
    const taskList = column.querySelector(".task-list");
    taskList.innerHTML = "";
    boardData[status].forEach((task, index) => {
      const el = document.createElement("article");
      el.className = "task kanban";
      el.draggable = true;
      el.dataset.index = index;
      el.innerHTML = `
                <h3 class="task__title">${escapeHtml(task.title)}</h3>
                ${task.desc ? `<p class="task__desc">${escapeHtml(task.desc)}</p>` : ""}
                <footer class="task__footer">
                <span class="task__label ${task.priority}">${task.priorityText}</span>
                <time class="task__date">${task.deadline ? escapeHtml(task.deadline) : ""}</time>
                </footer>
            `;
      addDragEvents(el);
      taskList.appendChild(el);
    });
    updateCount(column);
  });
  saveBoard();
}

function updateCount(column) {
  const countEl = column.querySelector(".column__count");
  const status = column.dataset.status;
  countEl.textContent = boardData[status].length;
}

function normalizePriority(value) {
  const v = String(value || "")
    .trim()
    .toLowerCase();
  if (["высокий", "выс", "в", "high", "h"].includes(v)) return "high";
  if (["средний", "сред", "с", "medium", "med", "m"].includes(v))
    return "medium";
  if (["низкий", "низ", "н", "low", "l"].includes(v)) return "low";
  return "medium";
}

function priorityLabel(level) {
  return level === "high"
    ? "Высокий приоритет"
    : level === "low"
      ? "Низкий приоритет"
      : "Средний приоритет";
}
renderBoard();
function saveBoard() {
  localStorage.setItem("kanbanData", JSON.stringify(boardData));
}

document.querySelectorAll(".add-task").forEach((btn) => {
  btn.addEventListener("click", () => {
    const column = btn.closest(".column");
    const status = column.dataset.status;

    const title = prompt("Введите название задачи:") || "";
    const desc = prompt("Описание (по желанию):") || "";
    const priorityInput =
      prompt("Приоритет (Высокий / Средний / Низкий):") || "Средний";
    const deadline = prompt("Срок (например: до 12.11):") || "";

    const cleanTitle = title.trim();
    const cleanDesc = desc.trim();
    const cleanDeadline = deadline.trim();

    if (cleanTitle === "") return;

    const level = normalizePriority(priorityInput);

    const newTask = {
      title: cleanTitle,
      desc: cleanDesc,
      deadline: cleanDeadline,
      priority: level,
      priorityText: priorityLabel(level),
    };

    boardData[status].push(newTask);

    renderBoard();
  });
});

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
// Переменная для хранения текущей перетаскиваемой карточки
let draggedItem = null; 
// Переменная для хранения статуса колонки,
let sourceStatus = null;

// Функция подключения drag-событий к одной карточке
function addDragEvents(el) {
  // Событие начала перетаскивания карточки
  el.addEventListener("dragstart", (e) => {
     // сохраняем ссылку на текущую перетаскиваемую карточку
    draggedItem = el;
    sourceStatus = el.closest(".column").dataset.status;
    el.classList.add("dragging");
    // указываем браузеру, что операция является переносом (move)
    e.dataTransfer.effectAllowed = "move";
  });
  // Событие завершения перетаскивания карточки
  el.addEventListener("dragend", () => {
    if (draggedItem) draggedItem.classList.remove("dragging");
    // очищаем переменную текущей карточки
    draggedItem = null;
  });
}

// Подключаем события приёма карточек для каждой колонки Kanban-доски
columns.forEach((column) => {
// внутри каждой колонки находим список задач
  const taskList = column.querySelector(".task-list");

  // Событие возникает при наведении перетаскиваемой карточки на колонку
  taskList.addEventListener("dragover", (e) => {
    e.preventDefault();
    column.classList.add("drag-over");
  });
// Событие возникает при выходе карточки за пределы колонки
  taskList.addEventListener("dragleave", () => {
    column.classList.remove("drag-over");
  });
    // Событие возникает при отпускании карточки над колонкой
  taskList.addEventListener("drop", (e) => {
    e.preventDefault();
    column.classList.remove("drag-over");
    // если карточка не определена — прекращаем выполнение
    if (!draggedItem) return;
   // определяем колонку назначения
    const targetStatus = column.dataset.status;
    if (sourceStatus === targetStatus) return; //добавление в ту же колонку 
    // определяем индекс карточки внутри исходной колонки   !!!!
    const sourceIndex = +draggedItem.dataset.index; //унарный плюс !!!!!
   // получаем объект задачи из исходного массива
    const movedTask = boardData[sourceStatus][sourceIndex];
   // удаляем задачу из исходной колонки
    boardData[sourceStatus].splice(sourceIndex, 1);
    // добавляем задачу в колонку назначения
    boardData[targetStatus].push(movedTask);
    
    draggedItem = null; // какая карточка сейчас тащится !!!
    sourceStatus = null;  // из какой колонки она взята   !!!
    renderBoard();
  });
});
