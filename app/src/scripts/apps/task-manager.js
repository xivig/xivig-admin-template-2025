/**
 * Elite Task Manager Module
 */
export const initTaskManager = () => {
    const container = document.querySelector('.task-manager-module');
    if (!container || !window.Sortable) return;

    const STORAGE_KEY = 'elite_architect_tasks_v3';

    const DEFAULT_TASKS = {
        todayTasks: [
            { id: 't1', title: 'Admin Framework Redesign', messages: 42, avatar: { initials: 'AL', color: '#ff4757' }, meta: 'Due Apr 20' },
            { id: 't2', title: 'API Security Protocol Audit', messages: 12, avatar: { initials: 'Dev', color: '#2ed573' }, meta: 'Due Apr 22' }
        ],
        upcomingTasks: [
            { id: 't3', title: 'iOS Component Testing', messages: 5, avatar: { initials: 'QA', color: '#ffa502' }, meta: 'Due May 01' }
        ],
        completedTasks: []
    };

    const renderTask = (item) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'task-item';
        wrapper.dataset.id = item.id;
        wrapper.dataset.messages = item.messages;
        wrapper.dataset.initials = item.avatar.initials;
        wrapper.dataset.color = item.avatar.color;
        wrapper.dataset.meta = item.meta;

        wrapper.innerHTML = `
            <div class="d-flex align-items-center gap-3 overflow-hidden">
                <div class="avatar-elite" style="background: ${item.avatar.color}">${item.avatar.initials}</div>
                <div class="overflow-hidden">
                    <div class="task-title text-truncate">${item.title}</div>
                    <div class="task-meta">
                        <i class="bi bi-clock me-1"></i> ${item.meta}
                        <span class="ms-2"><i class="bi bi-chat-dots me-1"></i> ${item.messages}</span>
                    </div>
                </div>
            </div>
            <div class="d-flex align-items-center gap-2 ms-3">
                <span class="msg-badge">${item.messages}</span>
                <div class="d-flex gap-1">
                    <button class="btn-action"><i class="bi bi-link-45deg"></i></button>
                    <button class="btn-action btn-delete">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        `;

        wrapper.querySelector('.btn-delete').addEventListener('click', () => {
            wrapper.remove();
            saveTasks();
        });

        return wrapper;
    };

    const saveTasks = () => {
        const data = {};
        ['todayTasks', 'upcomingTasks', 'completedTasks'].forEach(listId => {
            const listContainer = document.getElementById(listId);
            if (listContainer) {
                data[listId] = Array.from(listContainer.children).map(el => ({
                    id: el.dataset.id,
                    title: el.querySelector('.task-title').innerText,
                    messages: el.dataset.messages,
                    avatar: { initials: el.dataset.initials, color: el.dataset.color },
                    meta: el.dataset.meta
                }));
            }
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    };

    const loadTasks = () => {
        const saved = localStorage.getItem(STORAGE_KEY);
        const data = saved ? JSON.parse(saved) : DEFAULT_TASKS;

        Object.keys(data).forEach(listId => {
            const listContainer = document.getElementById(listId);
            if (listContainer) {
                listContainer.innerHTML = '';
                data[listId].forEach(task => listContainer.appendChild(renderTask(task)));
            }
        });
    };

    loadTasks();

    // Init Draggable
    ['todayTasks', 'upcomingTasks', 'completedTasks'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            new Sortable(el, {
                group: 'elite_tasks',
                animation: 300,
                easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
                ghostClass: 'sortable-ghost',
                chosenClass: 'sortable-chosen',
                onEnd: saveTasks
            });
        }
    });

    // Add Task
    const addBtn = document.getElementById('addTaskBtn');
    const inputTitle = document.getElementById('newTaskTitle');
    const selectAvatar = document.getElementById('newTaskAvatar');

    if (addBtn && inputTitle && selectAvatar) {
        addBtn.addEventListener('click', () => {
            const title = inputTitle.value;
            if (!title) return;

            const selectedOption = selectAvatar.options[selectAvatar.selectedIndex];
            const newTask = {
                id: 't' + Date.now(),
                title: title,
                messages: Math.floor(Math.random() * 10),
                avatar: {
                    initials: selectAvatar.value,
                    color: selectedOption.dataset.color
                },
                meta: 'Recently Added'
            };

            const target = document.getElementById('todayTasks');
            if (target) {
                target.prepend(renderTask(newTask));
                inputTitle.value = '';
                saveTasks();
            }
        });
    }
};
