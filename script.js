document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;

    let tasks = [];

    const colors = ['red', 'blue', 'green', 'yellow', 'purple'];
    let a1 = 0;

function changeColor() {
    const h1 = document.querySelector('h1');
    h1.style.color = colors[a1];
    a1 = (a1 + 1) % colors.length;
}

setInterval(changeColor, 1000);



    function loadTasks() {
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
            tasks = JSON.parse(savedTasks);
            displayTasks();
        }
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function addTask() {
        const taskInput = document.getElementById('task');
        const responsibleInput = document.getElementById('responsible');
        const dateInput = document.getElementById('date');
        const prioritySelect = document.getElementById('priority');

        const task = taskInput.value;
        const responsible = responsibleInput.value;
        const date = dateInput.value;
        const priority = prioritySelect.value;

        if (!task || !responsible || !date || !priority) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        const taskObject = { task, responsible, date, priority, status: '' };
        tasks.push(taskObject);
        displayTasks();
        saveTasks();

        clearTask();
    }

    function removeTask(index) { 
        tasks.splice(index, 1);
        displayTasks();
        saveTasks();
    }

    function displayTasks() {
        const taskList = document.getElementById('taskList');
        const filterTask = document.getElementById('filterTask').value.toLowerCase();
        const filterResponsible = document.getElementById('filterResponsible').value.toLowerCase();
        const filterDate = document.getElementById('filterDate').value;
        const filterPriority = document.getElementById('filterPriority').value;

        taskList.innerHTML = '';

        tasks
            .filter(task => task.task.toLowerCase().includes(filterTask))
            .filter(task => task.responsible.toLowerCase().includes(filterResponsible))
            .filter(task => !filterDate || task.date === filterDate)
            .filter(task => !filterPriority || task.priority === filterPriority)
            .forEach((task, index) => {
                const li = document.createElement('li');
                li.classList.add('task', task.priority.toLowerCase());

                if (task.status === 'completed') {
                    li.classList.add('completed');
                } else if (task.status === 'in-progress') {
                    li.classList.add('in-progress');
                }

                const taskText = document.createElement('span');
                taskText.textContent = `${task.task} (Responsável: ${task.responsible}, Data: ${task.date}, Prioridade: ${task.priority})`;

                const completedButton = document.createElement('button');
                completedButton.innerHTML = '<i class="fas fa-check"></i> CONCLUÍDO';
                completedButton.classList.add('status', 'completed');
                completedButton.onclick = () => {
                    task.status = 'completed';
                    displayTasks();
                    saveTasks();
                };

                const inProgressButton = document.createElement('button');
                inProgressButton.innerHTML = '<i class="fas fa-spinner"></i> EM PROGRESSO';
                inProgressButton.classList.add('status', 'in-progress');
                inProgressButton.onclick = () => {
                    task.status = 'in-progress';
                    displayTasks();
                    saveTasks();
                };

                const deleteButton = document.createElement('button');
                deleteButton.innerHTML = '<i class="fas fa-trash"></i> EXCLUIR';
                deleteButton.classList.add('delete');
                deleteButton.onclick = () => removeTask(index);

                const icon = document.createElement('span');
                icon.classList.add('icon');

                if (task.status === 'completed') {
                    icon.classList.add('show');
                    icon.innerHTML = '<i class="fas fa-check-circle"></i>';
                } else if (task.status === 'in-progress') {
                    icon.classList.add('show');
                    icon.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                } else {
                    icon.innerHTML = '';
                }

                li.appendChild(taskText);
                li.appendChild(completedButton);
                li.appendChild(inProgressButton);
                li.appendChild(deleteButton);
                li.appendChild(icon);
                taskList.appendChild(li);
            });
    }

    function applyFilters() {
        displayTasks();
    }

    function clearTask() {
        document.getElementById('task').value = '';
        document.getElementById('responsible').value = '';
        document.getElementById('date').value = today;
        document.getElementById('priority').value = 'Baixa';
    }

    function clearAllFields() {
        clearTask();
        document.getElementById('filterTask').value = '';
        document.getElementById('filterResponsible').value = '';
        document.getElementById('filterDate').value = '';
        document.getElementById('filterPriority').value = '';
        tasks = [];
        saveTasks();
        displayTasks();
    }

    document.getElementById('filterTask').addEventListener('input', applyFilters);
    document.getElementById('filterResponsible').addEventListener('input', applyFilters);
    document.getElementById('filterDate').addEventListener('change', applyFilters);
    document.getElementById('filterPriority').addEventListener('change', applyFilters);

    document.querySelector('button[onclick="addTask()"]').addEventListener('click', addTask);
    document.querySelector('button[onclick="clearAllFields()"]').addEventListener('click', clearAllFields);


 
    
    function clearAllFields() {
        if (confirm('Você tem certeza que deseja excluir todas as tarefas?')) {
            clearTask();
            document.getElementById('filterTask').value = '';
            document.getElementById('filterResponsible').value = '';
            document.getElementById('filterDate').value = '';
            document.getElementById('filterPriority').value = '';
            tasks = [];
            saveTasks();
            displayTasks();
        }
    }
    

    loadTasks();
});
