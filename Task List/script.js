const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTask');
const taskList = document.getElementById('taskList');
const API_URL = 'https://tasklist-backend-xxxx.onrender.com';

async function cargarTareas() {
    const res = await fetch(`${API_URL}/tareas`);
    const tareas = await res.json();
    taskList.innerHTML = '';
    tareas.forEach((tarea, idx) => {
        const li = document.createElement('li');
        li.innerHTML = `${tarea} <button class="delete">🗑</button>`;
        li.querySelector('.delete').addEventListener('click', async () => {
            await fetch(`${API_URL}/tareas/${idx}`, { method: 'DELETE' });
            cargarTareas();
        });
        taskList.appendChild(li);
    });
}

addTaskBtn.addEventListener('click', async () => {
    const tarea = taskInput.value.trim();
    if (tarea) {
        await fetch(`${API_URL}/tareas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tarea })
        });
        taskInput.value = '';
        cargarTareas();
    }
});

// Cargar tareas al iniciar
cargarTareas();
