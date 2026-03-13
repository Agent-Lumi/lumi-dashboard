// Lumi Dashboard - Interactive Features
// Made with 💡 by Agent-Lumi

// Quotes Database
const quotes = [
    { text: "The best way to predict the future is to create it.", author: "Peter Drucker" },
    { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
    { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
    { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
    { text: "Make it work, make it right, make it fast.", author: "Kent Beck" },
    { text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler" },
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Knowledge is power.", author: "Francis Bacon" },
    { text: "Stay hungry, stay foolish.", author: "Steve Jobs" },
    { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
    { text: "The journey of a thousand miles begins with one step.", author: "Lao Tzu" },
    { text: "What we think, we become.", author: "Buddha" },
    { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" }
];

// State
let timerInterval = null;
let timeLeft = 25 * 60; // 25 minutes in seconds
let isTimerRunning = false;
let quotesSeen = 1;
let tasksCompleted = 0;
let focusSessions = 0;
let tasks = []; // Store tasks in memory

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', () => {
    loadTheme(); // Load saved theme first
    loadData(); // Load saved data
    updateClock();
    setInterval(updateClock, 1000);
    updateGreeting();
    updateDate();
    fetchWeather();
    setupTaskListeners();
    loadTasks(); // Load saved tasks
});

// Theme Toggle Functions
function toggleTheme() {
    const body = document.body;
    const isLight = body.classList.toggle('light-theme');
    
    // Save theme preference
    localStorage.setItem('lumiTheme', isLight ? 'light' : 'dark');
    
    // Update toggle button icon
    const toggleBtn = document.getElementById('themeToggle');
    if (toggleBtn) {
        toggleBtn.textContent = isLight ? '🌙' : '☀️';
        toggleBtn.title = isLight ? 'Switch to dark mode' : 'Switch to light mode';
    }
}

function loadTheme() {
    const savedTheme = localStorage.getItem('lumiTheme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
    }
}

// Data Persistence Functions
function saveData() {
    const data = {
        quotesSeen: quotesSeen,
        tasksCompleted: tasksCompleted,
        focusSessions: focusSessions,
        tasks: tasks
    };
    localStorage.setItem('lumiDashboardData', JSON.stringify(data));
}

function loadData() {
    const saved = localStorage.getItem('lumiDashboardData');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            quotesSeen = data.quotesSeen || 1;
            tasksCompleted = data.tasksCompleted || 0;
            focusSessions = data.focusSessions || 0;
            tasks = data.tasks || [];
            updateStats();
        } catch (e) {
            console.log('Error loading saved data:', e);
        }
    }
}

function loadTasks() {
    if (tasks.length > 0) {
        const taskList = document.getElementById('taskList');
        taskList.innerHTML = ''; // Clear default tasks
        
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = 'task-item';
            if (task.completed) li.classList.add('completed');
            
            li.innerHTML = `
                <input type="checkbox" id="${task.id}" ${task.completed ? 'checked' : ''}>
                <label for="${task.id}">${escapeHtml(task.text)}</label>
                <button class="delete-task" onclick="deleteTask('${task.id}')">×</button>
            `;
            
            li.querySelector('input').addEventListener('change', handleTaskToggle);
            taskList.appendChild(li);
        });
        
        updateTaskStats();
    }
}

function saveTasks() {
    saveData();
}

function updateTaskStats() {
    const checked = document.querySelectorAll('.task-item.completed').length;
    tasksCompleted = checked;
    updateStats();
    saveData();
}

function deleteTask(taskId) {
    tasks = tasks.filter(t => t.id !== taskId);
    const taskEl = document.getElementById(taskId);
    if (taskEl) {
        taskEl.closest('.task-item').remove();
    }
    saveData();
}

// Clock Functions
function updateClock() {
    const now = new Date();
    // Arizona time (Mountain Standard Time - UTC-7)
    const options = { 
        timeZone: 'America/Phoenix',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    const timeString = now.toLocaleTimeString('en-US', options);
    document.getElementById('clock').textContent = timeString;
}

function updateGreeting() {
    const hour = new Date().getHours();
    let greeting = 'Good morning!';
    if (hour >= 12) greeting = 'Good afternoon!';
    if (hour >= 18) greeting = 'Good evening!';
    document.getElementById('greeting').textContent = greeting;
}

function updateDate() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('date').textContent = now.toLocaleDateString('en-US', options);
}

// Weather Function (using wttr.in as a free API)
async function fetchWeather() {
    const weatherEl = document.getElementById('weather');
    
    try {
        // Get weather for Phoenix, Arizona (Fahrenheit)
        const response = await fetch('https://wttr.in/Phoenix?format=j1');
        const data = await response.json();
        
        const current = data.current_condition[0];
        const temp = current.temp_F;  // Changed to Fahrenheit
        const desc = current.weatherDesc[0].value;
        
        weatherEl.innerHTML = `
            <div class="weather-temp">${temp}°F</div>
            <div class="weather-desc">${desc}</div>
            <div class="weather-location">📍 Phoenix, AZ</div>
        `;
    } catch (error) {
        weatherEl.innerHTML = `
            <div class="weather-temp">🌤️</div>
            <div class="weather-desc">Weather data unavailable</div>
            <div class="weather-location">Check your internet connection</div>
        `;
    }
}

// Quote Functions
function refreshQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    
    document.getElementById('quote').textContent = `"${quote.text}"`;
    document.getElementById('quoteAuthor').textContent = `— ${quote.author}`;
    
    quotesSeen++;
    updateStats();
    saveData();
}

// Task Functions
function setupTaskListeners() {
    const checkboxes = document.querySelectorAll('.task-item input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleTaskToggle);
    });
}

function handleTaskToggle(e) {
    const taskItem = e.target.closest('.task-item');
    const taskId = e.target.id;
    const isChecked = e.target.checked;
    
    // Update visual state
    if (isChecked) {
        taskItem.classList.add('completed');
    } else {
        taskItem.classList.remove('completed');
    }
    
    // Update in-memory tasks
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = isChecked;
    }
    
    updateTaskStats();
    saveTasks();
}

function handleTaskKeypress(e) {
    if (e.key === 'Enter') {
        addTask();
    }
}

function addTask() {
    const input = document.getElementById('newTask');
    const taskText = input.value.trim();
    
    if (taskText) {
        const taskId = `task${Date.now()}`;
        const taskList = document.getElementById('taskList');
        
        // Add to in-memory storage
        tasks.push({
            id: taskId,
            text: taskText,
            completed: false
        });
        
        // Create DOM element
        const li = document.createElement('li');
        li.className = 'task-item';
        li.innerHTML = `
            <input type="checkbox" id="${taskId}">
            <label for="${taskId}">${escapeHtml(taskText)}</label>
            <button class="delete-task" onclick="deleteTask('${taskId}')">×</button>
        `;
        
        li.querySelector('input').addEventListener('change', handleTaskToggle);
        taskList.appendChild(li);
        
        input.value = '';
        saveData();
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Timer Functions
function startTimer() {
    if (!isTimerRunning) {
        isTimerRunning = true;
        timerInterval = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateTimerDisplay();
            } else {
                clearInterval(timerInterval);
                isTimerRunning = false;
                focusSessions++;
                updateStats();
                saveData();
                alert('🎉 Focus session complete! Great job!');
                resetTimer();
            }
        }, 1000);
    }
}

function pauseTimer() {
    if (isTimerRunning) {
        clearInterval(timerInterval);
        isTimerRunning = false;
    }
}

function resetTimer() {
    pauseTimer();
    timeLeft = 25 * 60;
    updateTimerDisplay();
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('timer').textContent = 
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Stats Functions
function updateStats() {
    document.getElementById('tasksCompleted').textContent = tasksCompleted;
    document.getElementById('focusSessions').textContent = focusSessions;
    document.getElementById('quotesSeen').textContent = quotesSeen;
}

// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
    // Space to start/pause timer when focus widget is visible
    if (e.code === 'Space' && !e.target.matches('input')) {
        e.preventDefault();
        if (isTimerRunning) {
            pauseTimer();
        } else {
            startTimer();
        }
    }
});

// Console Easter Egg
console.log('%c💡 Lumi Dashboard', 'font-size: 24px; font-weight: bold; color: #6f42c1;');
console.log('%cMade with love by Agent-Lumi for @shalkith', 'font-size: 14px; color: #8b5cf6;');
console.log('%c"Bright, warm, and here to help light the way!"', 'font-style: italic; color: #a1a1aa;');
