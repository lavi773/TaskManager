// Select DOM elements
const todoInput = document.getElementById('todo-input');
const todoDate = document.getElementById('todo-date');
const todoList = document.getElementById('todo-list');
const form = document.getElementById('todo-form');
const filterBtns = document.querySelectorAll('.filter-btn');

// State
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let filter = 'all';

// 1. Initialize App
document.addEventListener('DOMContentLoaded', () => {
    displayDate();
    fetchQuote(); // API Call
    renderTodos();
});

// 2. Display Date
function displayDate() {
    const dateElem = document.getElementById('date-display');
    const options = { weekday: 'long', month: 'short', day: 'numeric' };
    dateElem.innerText = new Date().toLocaleDateString('en-US', options);
}

// 3. API Call: Fetch Quote
async function fetchQuote() {
    const quoteText = document.getElementById('quote-text');
    const quoteAuthor = document.getElementById('quote-author');
    
    try {
        const response = await fetch('https://api.quotable.io/random');
        const data = await response.json();
        quoteText.innerText = `"${data.content}"`;
        quoteAuthor.innerText = `- ${data.author}`;
    } catch (error) {
        quoteText.innerText = "Stay focused and never give up!";
        quoteAuthor.innerText = "- Anonymous";
    }
}

// 4. Add Task
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const newTodo = {
        id: Date.now(),
        text: todoInput.value,
        date: todoDate.value,
        completed: false
    };

    todos.push(newTodo);
    saveAndRender();
    form.reset();
});

// 5. Delete Task
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveAndRender();
}

// 6. Toggle Complete
function toggleComplete(id) {
    todos = todos.map(todo => {
        if (todo.id === id) {
            return { ...todo, completed: !todo.completed };
        }
        return todo;
    });
    saveAndRender();
}

// 7. Save to LocalStorage & Render
function saveAndRender() {
    localStorage.setItem('todos', JSON.stringify(todos));
    renderTodos();
}

// 8. Render Logic
function renderTodos() {
    todoList.innerHTML = '';

    let filteredTodos = [];
    if (filter === 'all') filteredTodos = todos;
    else if (filter === 'pending') filteredTodos = todos.filter(t => !t.completed);
    else if (filter === 'completed') filteredTodos = todos.filter(t => t.completed);

    filteredTodos.forEach(todo => {
        const li = document.createElement('li');
        li.classList.add('todo-item');
        if (todo.completed) li.classList.add('completed');

        li.innerHTML = `
            <div class="todo-content">
                <span>${todo.text}</span>
                <small class="todo-date">Due: ${todo.date}</small>
            </div>
            <div class="actions">
                <button class="check-btn" onclick="toggleComplete(${todo.id})">
                    <i class="fas fa-check"></i>
                </button>
                <button class="trash-btn" onclick="deleteTodo(${todo.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        todoList.appendChild(li);
    });
}

// 9. Filter Logic
function filterTasks(status) {
    filter = status;
    
    // Update UI buttons
    filterBtns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    renderTodos();
}