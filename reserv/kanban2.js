// Урок 37

const columns = document.querySelectorAll('.column');

let boardData = JSON.parse(localStorage.getItem("kanbanData")) || {
    todo: [], 
    'in-progress': [],
    done: [], 
};

function renderBoard() {
    columns.forEach((column) => {
        const status = column.dataset.status;
        const taskList = column.querySelector('.task-list');
        taskList.innerHTML = '';
        boardData[status].forEach((task, index) => {
            const el = document.createElement('article');
            el.className = 'task kanban';
            el.draggable = true;
            el.dataset.index = index;
            el.innerHTML = `
                <h3 class="task__title">${escapeHtml(task.title)}</h3>
                ${task.desc ? `<p class="task__desc">${escapeHtml(task.desc)}</p>` : ""}
                <footer class="task__footer">
                <span class="task__label ${task.priority}">${task.priorityText}</span>
                <time class="task__date">${task.deadline ? escapeHtml(task.deadline) : ''}</time>
                </footer>
            `;
            taskList.appendChild(el);
        });
        updateCount(column);
    })
    saveBoard();
}

function updateCount(column) {
    const countEl = column.querySelector('.column__count');
    const status = column.dataset.status;
    countEl.textContent = boardData[status].length;
}



function normalizePriority(value) {
    const v = String(value || '').trim().toLowerCase();
    if (['высокий', 'выс', 'в', 'high', 'h'].includes(v)) return 'high';
    if (['средний', 'сред', 'с', 'medium', 'med', 'm'].includes(v)) return 'medium';
    if (['низкий', 'низ', 'н', 'low', 'l'].includes(v)) return 'low';
    return 'medium';
}

function priorityLabel(level) {
    return level === 'high' ? 'Высокий приоритет'
    : level === 'low' ? 'Низкий приоритет'
    : 'Средний приоритет';
}
renderBoard();
function saveBoard() {
    localStorage.setItem('kanbanData', JSON.stringify(boardData));
}

document.querySelectorAll('.add-task').forEach(btn => {
    btn.addEventListener('click', () => {
        const column = btn.closest('.column');
        const status = column.dataset.status;

        const title = prompt('Введите название задачи:') || '';
        const desc = prompt('Описание (по желанию):') || '';
        const priorityInput = prompt('Приоритет (Высокий / Средний / Низкий):') || 'Средний';
        const deadline = prompt('Срок (например: до 12.11):') || '';

        const cleanTitle = title.trim();
        const cleanDesc = desc.trim();
        const cleanDeadline = deadline.trim();

        if (cleanTitle === '') return;

        const level = normalizePriority(priorityInput);

        const newTask = {
            title: cleanTitle,
            desc: cleanDesc,
            deadline: cleanDeadline,
            priority: level, 
            priorityText: priorityLabel(level)
        };

        boardData[status].push(newTask);

        renderBoard();
    });
});

function escapeHtml(str) {
    return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}