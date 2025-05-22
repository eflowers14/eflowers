document.getElementById('addTask').addEventListener('click', () => {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();
    if (taskText) {
        const li = document.createElement('li');
        li.innerHTML = `${taskText} <span class="delete">🗑</span>`;
        document.getElementById('taskList').appendChild(li);
        taskInput.value = '';

        li.querySelector('.delete').addEventListener('click', () => {
            li.remove();
        });
    }
});