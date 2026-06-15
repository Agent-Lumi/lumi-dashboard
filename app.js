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
let notes = []; // Store notes in memory
let habits = []; // Store habits in memory

// PWA State
let deferredPrompt = null;
let isPWAInstalled = false;
let isOffline = false;

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
    loadNotes(); // Load saved notes
    setupNotesListeners();
    loadHabits(); // Load saved habits
    setupHabitListeners();
    initPWA(); // Initialize PWA features
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
        tasks: tasks,
        notes: notes,
        habits: habits
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
            notes = data.notes || [];
            habits = data.habits || [];
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
let currentLocation = localStorage.getItem('lumiWeatherLocation') || 'Phoenix, AZ';
let isWeatherLoading = false;

// Weather icon mapping based on wttr.in codes
function getWeatherIcon(code) {
    const iconMap = {
        '113': '☀️', // Clear/Sunny
        '116': '🌤️', // Partly cloudy
        '119': '☁️', // Cloudy
        '122': '☁️', // Overcast
        '143': '🌫️', // Mist
        '176': '🌦️', // Patchy rain possible
        '179': '🌨️', // Patchy snow possible
        '182': '🌨️', // Patchy sleet possible
        '185': '🌨️', // Patchy freezing drizzle possible
        '200': '⛈️', // Thundery outbreaks possible
        '227': '🌨️', // Blowing snow
        '230': '❄️', // Blizzard
        '248': '🌫️', // Fog
        '260': '🌫️', // Freezing fog
        '263': '🌦️', // Patchy light drizzle
        '266': '🌧️', // Light drizzle
        '281': '🌧️', // Freezing drizzle
        '284': '🌧️', // Heavy freezing drizzle
        '293': '🌦️', // Patchy light rain
        '296': '🌧️', // Light rain
        '299': '🌧️', // Moderate rain at times
        '302': '🌧️', // Moderate rain
        '305': '🌧️', // Heavy rain at times
        '308': '🌧️', // Heavy rain
        '311': '🌧️', // Light freezing rain
        '314': '🌧️', // Moderate or heavy freezing rain
        '317': '🌨️', // Light sleet
        '320': '🌨️', // Moderate or heavy sleet
        '323': '🌨️', // Patchy light snow
        '326': '🌨️', // Light snow
        '329': '❄️', // Patchy moderate snow
        '332': '❄️', // Moderate snow
        '335': '❄️', // Patchy heavy snow
        '338': '❄️', // Heavy snow
        '350': '🌨️', // Ice pellets
        '353': '🌦️', // Light rain shower
        '356': '🌧️', // Moderate or heavy rain shower
        '359': '🌧️', // Torrential rain shower
        '362': '🌨️', // Light sleet showers
        '365': '🌨️', // Moderate or heavy sleet showers
        '368': '🌨️', // Light snow showers
        '371': '❄️', // Moderate or heavy snow showers
        '374': '🌨️', // Light showers of ice pellets
        '377': '🌨️', // Moderate or heavy showers of ice pellets
        '386': '⛈️', // Patchy light rain with thunder
        '389': '⛈️', // Moderate or heavy rain with thunder
        '392': '⛈️', // Patchy light snow with thunder
        '395': '⛈️', // Moderate or heavy snow with thunder
    };
    return iconMap[code] || '🌡️';
}

async function fetchWeather() {
    const weatherEl = document.getElementById('weather');
    const refreshBtn = document.querySelector('.weather-widget .refresh-btn');
    
    if (isWeatherLoading) return;
    isWeatherLoading = true;
    
    if (refreshBtn) {
        refreshBtn.classList.add('spinning');
    }
    
    try {
        // Try to get user's location first
        let location = currentLocation;
        let locationDisplay = location;
        
        // If no saved location, try geolocation
        if (!localStorage.getItem('lumiWeatherLocation') && navigator.geolocation) {
            try {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject, {
                        timeout: 5000,
                        enableHighAccuracy: false
                    });
                });
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                location = `${lat},${lon}`;
                locationDisplay = '📍 Current Location';
            } catch (geoError) {
                console.log('Geolocation failed, using default:', geoError);
                location = 'Phoenix, AZ';
                locationDisplay = '📍 Phoenix, AZ';
            }
        } else {
            locationDisplay = `📍 ${location}`;
        }
        
        // Fetch weather from wttr.in
        const response = await fetch(`https://wttr.in/${encodeURIComponent(location)}?format=j1`);
        const data = await response.json();
        
        const current = data.current_condition[0];
        const temp = current.temp_F;
        const desc = current.weatherDesc[0].value;
        const humidity = current.humidity;
        const windSpeed = current.windspeedMiles;
        const feelsLike = current.FeelsLikeF;
        const weatherCode = current.weatherCode;
        
        // Get weather icon
        const icon = getWeatherIcon(weatherCode);
        
        // Save location for future use
        if (location !== `${data.nearest_area[0].latitude},${data.nearest_area[0].longitude}`) {
            currentLocation = data.nearest_area[0].areaName[0].value + ', ' + data.nearest_area[0].region[0].value;
            localStorage.setItem('lumiWeatherLocation', currentLocation);
        }
        
        weatherEl.innerHTML = `
            <div class="weather-main">
                <div class="weather-icon">${icon}</div>
                <div class="weather-temp">${temp}°F</div>
            </div>
            <div class="weather-desc">${desc}</div>
            <div class="weather-location">${locationDisplay}</div>
            <div class="weather-details">
                <div class="weather-detail">
                    <div class="weather-detail-value">${feelsLike}°F</div>
                    <div class="weather-detail-label">Feels Like</div>
                </div>
                <div class="weather-detail">
                    <div class="weather-detail-value">${humidity}%</div>
                    <div class="weather-detail-label">Humidity</div>
                </div>
                <div class="weather-detail">
                    <div class="weather-detail-value">${windSpeed} mph</div>
                    <div class="weather-detail-label">Wind</div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Weather fetch error:', error);
        weatherEl.innerHTML = `
            <div class="weather-main">
                <div class="weather-icon">🌡️</div>
                <div class="weather-temp">--°F</div>
            </div>
            <div class="weather-desc">Unable to load weather</div>
            <div class="weather-location">📍 ${currentLocation}</div>
            <div class="weather-details">
                <div class="weather-detail">
                    <div class="weather-detail-value">--</div>
                    <div class="weather-detail-label">Feels Like</div>
                </div>
                <div class="weather-detail">
                    <div class="weather-detail-value">--</div>
                    <div class="weather-detail-label">Humidity</div>
                </div>
                <div class="weather-detail">
                    <div class="weather-detail-value">--</div>
                    <div class="weather-detail-label">Wind</div>
                </div>
            </div>
        `;
    } finally {
        isWeatherLoading = false;
        if (refreshBtn) {
            refreshBtn.classList.remove('spinning');
        }
    }
}

function refreshWeather() {
    fetchWeather();
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

function refreshStats() {
    updateStats();
    showNotification('Stats refreshed! 📊', 'success');
}

// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
    // Space to start/pause timer when focus widget is visible
    if (e.code === 'Space' && !e.target.matches('input, textarea')) {
        e.preventDefault();
        if (isTimerRunning) {
            pauseTimer();
        } else {
            startTimer();
        }
    }
    
    // Ctrl/Cmd + T - Focus task input
    if ((e.ctrlKey || e.metaKey) && e.key === 't') {
        e.preventDefault();
        document.getElementById('newTask')?.focus();
    }
    
    // Ctrl/Cmd + H - Focus habit input
    if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
        e.preventDefault();
        document.getElementById('newHabit')?.focus();
    }
    
    // Ctrl/Cmd + R - Refresh quote
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        refreshQuote();
    }
    
    // Ctrl/Cmd + W - Refresh weather
    if ((e.ctrlKey || e.metaKey) && e.key === 'w') {
        e.preventDefault();
        refreshWeather();
    }
    
    // Ctrl/Cmd + D - Toggle theme
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        toggleTheme();
    }
    
    // Escape - Pause timer
    if (e.key === 'Escape') {
        pauseTimer();
        document.getElementById('newTask')?.blur();
        document.getElementById('newHabit')?.blur();
    }
});

// Export/Import Functions
function exportData() {
    const data = {
        tasks: tasks,
        notes: notes,
        habits: habits,
        quotesSeen: quotesSeen,
        tasksCompleted: tasksCompleted,
        focusSessions: focusSessions,
        exportDate: new Date().toISOString(),
        version: '1.2'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lumi-dashboard-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('Data exported successfully! 💾', 'success');
}

function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                
                if (data.tasks) {
                    tasks = data.tasks;
                    loadTasks();
                }
                if (data.notes) {
                    notes = data.notes;
                    loadNotes();
                }
                if (data.habits) {
                    habits = data.habits;
                    loadHabits();
                }
                if (data.quotesSeen) quotesSeen = data.quotesSeen;
                if (data.tasksCompleted) tasksCompleted = data.tasksCompleted;
                if (data.focusSessions) focusSessions = data.focusSessions;
                
                updateStats();
                saveData();
                showNotification('Data imported successfully! 📥', 'success');
            } catch (err) {
                showNotification('Failed to import data. Invalid file format.', 'error');
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

function resetData() {
    if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
        tasks = [];
        notes = [];
        habits = [];
        quotesSeen = 1;
        tasksCompleted = 0;
        focusSessions = 0;
        localStorage.removeItem('lumiDashboardData');
        localStorage.removeItem('lumiWeatherLocation');
        localStorage.removeItem('lumiTheme');
        
        document.getElementById('taskList').innerHTML = `
            <li class="task-item">
                <input type="checkbox" id="task1">
                <label for="task1">Check out my new dashboard!</label>
            </li>
            <li class="task-item">
                <input type="checkbox" id="task2">
                <label for="task2">Built by Agent-Lumi 💡</label>
            </li>
        `;
        setupTaskListeners();
        loadNotes();
        loadHabits();
        updateStats();;
        
        showNotification('Data reset successfully! 🔄', 'success');
    }
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 8px;
        font-weight: 500;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    if (type === 'success') {
        notification.style.background = '#10b981';
        notification.style.color = 'white';
    } else if (type === 'error') {
        notification.style.background = '#ef4444';
        notification.style.color = 'white';
    } else {
        notification.style.background = '#6f42c1';
        notification.style.color = 'white';
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Sound notification for timer (optional)
function playTimerSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
}

// Override startTimer to add sound
const originalStartTimer = startTimer;
window.startTimer = function() {
    if (!isTimerRunning) {
        playTimerSound();
        originalStartTimer();
    }
};

// Console Easter Egg
console.log('%c💡 Lumi Dashboard', 'font-size: 24px; font-weight: bold; color: #6f42c1;');
console.log('%cMade with love by Agent-Lumi for @shalkith', 'font-size: 14px; color: #8b5cf6;');
console.log('%c"Bright, warm, and here to help light the way!"', 'font-style: italic; color: #a1a1aa;');
console.log('%c📱 PWA Enabled - Install for offline access!', 'font-size: 12px; color: #22c55e;');

// PWA Functions
function initPWA() {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || 
        window.navigator.standalone === true) {
        isPWAInstalled = true;
        console.log('[PWA] App already installed');
    }

    // Register service worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then((registration) => {
                console.log('[PWA] Service Worker registered:', registration.scope);
                
                // Check for updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            showNotification('Update available! Refresh to update.', 'success');
                        }
                    });
                });
            })
            .catch((err) => {
                console.error('[PWA] Service Worker registration failed:', err);
            });
    }

    // Listen for beforeinstallprompt
    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        // Store the event for later use
        deferredPrompt = e;
        // Show the install widget
        showInstallWidget();
        console.log('[PWA] Install prompt available');
    });

    // Listen for app installed
    window.addEventListener('appinstalled', () => {
        isPWAInstalled = true;
        deferredPrompt = null;
        hideInstallWidget();
        showNotification('App installed successfully! 🎉', 'success');
        console.log('[PWA] App installed');
    });

    // Online/offline detection
    window.addEventListener('online', () => {
        isOffline = false;
        updateOfflineIndicator();
        showNotification('Back online! 🌐', 'success');
    });

    window.addEventListener('offline', () => {
        isOffline = true;
        updateOfflineIndicator();
        showNotification('You\'re offline. App still works! 📱', 'info');
    });

    // Initial offline check
    isOffline = !navigator.onLine;
    updateOfflineIndicator();
}

function showInstallWidget() {
    if (isPWAInstalled || localStorage.getItem('pwaDismissed') === 'true') {
        return;
    }
    const widget = document.getElementById('pwaWidget');
    if (widget) {
        widget.style.display = 'block';
        // Add animation
        widget.style.animation = 'slideIn 0.5s ease-out';
    }
}

function hideInstallWidget() {
    const widget = document.getElementById('pwaWidget');
    if (widget) {
        widget.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            widget.style.display = 'none';
        }, 300);
    }
}

async function installPWA() {
    if (!deferredPrompt) {
        showNotification('App already installed or not available', 'info');
        return;
    }

    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for user response
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
        console.log('[PWA] User accepted install');
        isPWAInstalled = true;
    } else {
        console.log('[PWA] User dismissed install');
    }
    
    // Clear the deferred prompt
    deferredPrompt = null;
}

function dismissPWA() {
    hideInstallWidget();
    localStorage.setItem('pwaDismissed', 'true');
    console.log('[PWA] Install widget dismissed');
}

function updateOfflineIndicator() {
    const indicator = document.getElementById('offlineIndicator');
    if (indicator) {
        if (isOffline) {
            indicator.style.display = 'flex';
            indicator.classList.add('show');
        } else {
            indicator.classList.remove('show');
            setTimeout(() => {
                indicator.style.display = 'none';
            }, 300);
        }
    }
}

// Timer Mode Function
let timerMode = 'pomodoro';
const timerPresets = {
    pomodoro: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60
};

function setTimerMode(mode) {
    timerMode = mode;
    timeLeft = timerPresets[mode];
    updateTimerDisplay();
    
    // Update active button
    document.querySelectorAll('.timer-mode-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`${mode}ModeBtn`)?.classList.add('active');
    
    // Update timer color based on mode
    const timerDisplay = document.getElementById('timer');
    if (timerDisplay) {
        timerDisplay.className = 'timer-display ' + mode;
    }
}

// Calculator Functions
let calcCurrent = '';
let calcPrevious = '';
let calcOperation = null;
let calcResetNext = false;

function calcInput(number) {
    if (calcResetNext) {
        calcCurrent = '';
        calcResetNext = false;
    }
    
    // Prevent multiple decimals
    if (number === '.' && calcCurrent.includes('.')) return;
    
    calcCurrent += number;
    updateCalcDisplay();
}

function calcOperator(op) {
    if (calcCurrent === '') return;
    if (calcPrevious !== '') {
        calcEquals();
    }
    calcOperation = op;
    calcPrevious = calcCurrent;
    calcCurrent = '';
}

function calcEquals() {
    let computation;
    const prev = parseFloat(calcPrevious);
    const current = parseFloat(calcCurrent);
    
    if (isNaN(prev) || isNaN(current)) return;
    
    switch (calcOperation) {
        case '+':
            computation = prev + current;
            break;
        case '-':
            computation = prev - current;
            break;
        case '*':
            computation = prev * current;
            break;
        case '/':
            if (current === 0) {
                showNotification('Cannot divide by zero! ⚠️', 'error');
                clearCalculator();
                return;
            }
            computation = prev / current;
            break;
        default:
            return;
    }
    
    calcCurrent = String(Math.round(computation * 100000000) / 100000000);
    calcOperation = null;
    calcPrevious = '';
    calcResetNext = true;
    updateCalcDisplay();
}

function clearCalculator() {
    calcCurrent = '';
    calcPrevious = '';
    calcOperation = null;
    calcResetNext = false;
    updateCalcDisplay();
}

function updateCalcDisplay() {
    const display = document.getElementById('calcDisplay');
    if (display) {
        display.textContent = calcCurrent === '' ? '0' : calcCurrent;
    }
}

// Add keyboard support for calculator
document.addEventListener('keydown', (e) => {
    // Calculator keyboard shortcuts
    if (document.activeElement !== document.querySelector('#noteInput') && 
        document.activeElement !== document.querySelector('#newTask')) {
        const key = e.key;
        
        if (/[0-9]/.test(key)) {
            calcInput(key);
        } else if (key === '.') {
            calcInput('.');
        } else if (key === '+' || key === '-' || key === '*' || key === '/') {
            calcOperator(key);
        } else if (key === 'Enter') {
            calcEquals();
        } else if (key === 'Escape') {
            clearCalculator();
        } else if (key === 'Backspace') {
            calcCurrent = calcCurrent.slice(0, -1);
            updateCalcDisplay();
        }
    }
});

// Export keyboard shortcut (already added but adding Ctrl+E)
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        exportData();
    }
});

document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'R') {
        e.preventDefault();
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then((registration) => {
                registration.update();
                showNotification('Checking for updates... 🔄', 'info');
            });
        }
    }
});

// Notes Widget Functions
function setupNotesListeners() {
    const noteInput = document.getElementById('noteInput');
    if (noteInput) {
        noteInput.addEventListener('keydown', handleNoteKeypress);
    }
}

function handleNoteKeypress(e) {
    // Enter to save (Shift+Enter for new line)
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        addNote();
    }
}

function loadNotes() {
    const notesList = document.getElementById('notesList');
    if (!notesList) return;
    
    if (notes.length === 0) {
        notesList.innerHTML = `
            <li class="notes-empty">
                <div class="notes-empty-icon">📝</div>
                <div>No notes yet</div>
                <div style="font-size: 0.85rem; margin-top: 0.25rem;">Add your first note above!</div>
            </li>
        `;
        return;
    }
    
    notesList.innerHTML = '';
    
    // Display notes in reverse order (newest first)
    [...notes].reverse().forEach(note => {
        const li = createNoteElement(note);
        notesList.appendChild(li);
    });
}

function createNoteElement(note) {
    const li = document.createElement('li');
    li.className = 'note-item';
    li.dataset.noteId = note.id;
    
    const timestamp = new Date(note.timestamp).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
    });
    
    li.innerHTML = `
        <div class="note-content">
            <div>${escapeHtml(note.text)}</div>
            <div class="note-timestamp">${timestamp}</div>
        </div>
        <button class="delete-note" onclick="deleteNote('${note.id}')" title="Delete note">×</button>
    `;
    
    return li;
}

function addNote() {
    const noteInput = document.getElementById('noteInput');
    const noteText = noteInput.value.trim();
    
    if (!noteText) {
        showNotification('Please enter a note first! 📝', 'error');
        return;
    }
    
    const newNote = {
        id: `note_${Date.now()}`,
        text: noteText,
        timestamp: Date.now()
    };
    
    notes.push(newNote);
    saveData();
    
    // Clear input
    noteInput.value = '';
    
    // Refresh notes list
    loadNotes();
    
    showNotification('Note added! ✅', 'success');
}

function deleteNote(noteId) {
    const noteEl = document.querySelector(`[data-note-id="${noteId}"]`);
    if (noteEl) {
        noteEl.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            notes = notes.filter(n => n.id !== noteId);
            saveData();
            loadNotes();
        }, 300);
    }
}

function clearNotes() {
    if (notes.length === 0) {
        showNotification('No notes to clear! 📝', 'info');
        return;
    }
    
    if (confirm(`Are you sure you want to delete all ${notes.length} note(s)? This cannot be undone.`)) {
        notes = [];
        saveData();
        loadNotes();
        showNotification('All notes cleared! 🗑️', 'success');
    }
}

// Habit Tracker Functions
let habits = []; // Store habits in memory

function setupHabitListeners() {
    const habitInput = document.getElementById('newHabit');
    if (habitInput) {
        habitInput.addEventListener('keydown', handleHabitKeypress);
    }
}

function handleHabitKeypress(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        addHabit();
    }
}

function getTodayString() {
    return new Date().toISOString().split('T')[0];
}

function getLast7Days() {
    const days = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        days.push(d.toISOString().split('T')[0]);
    }
    return days;
}

function calculateStreak(habit) {
    const dates = Object.keys(habit.completedDates).sort().reverse();
    if (dates.length === 0) return 0;
    
    const today = getTodayString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    // If not completed today and not yesterday, streak is broken
    if (!habit.completedDates[today] && !habit.completedDates[yesterdayStr]) {
        return 0;
    }
    
    // Count consecutive days
    let streak = 0;
    let checkDate = new Date();
    
    // Start from today, go backwards
    while (true) {
        const dateStr = checkDate.toISOString().split('T')[0];
        if (habit.completedDates[dateStr]) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
        } else {
            // If today is not completed, check if yesterday was
            if (dateStr === today && streak === 0) {
                checkDate.setDate(checkDate.getDate() - 1);
                continue;
            }
            break;
        }
    }
    
    return streak;
}

function getStreakEmoji(streak) {
    if (streak >= 30) return '🔥🔥🔥';
    if (streak >= 14) return '🔥🔥';
    if (streak >= 7) return '🔥';
    return '';
}

function loadHabits() {
    const habitList = document.getElementById('habitList');
    if (!habitList) return;
    
    if (habits.length === 0) {
        habitList.innerHTML = `
            <li class="habit-empty">
                <div class="habit-empty-icon">🔥</div>
                <div>No habits yet</div>
                <div style="font-size: 0.85rem; margin-top: 0.25rem;">Start building streaks! Add your first habit above.</div>
            </li>
        `;
        updateHabitStats();
        return;
    }
    
    habitList.innerHTML = '';
    const last7Days = getLast7Days();
    const today = getTodayString();
    
    habits.forEach(habit => {
        const streak = calculateStreak(habit);
        const isCompletedToday = habit.completedDates[today] || false;
        const streakEmoji = getStreakEmoji(streak);
        
        const li = document.createElement('li');
        li.className = `habit-item ${isCompletedToday ? 'completed' : ''}`;
        li.dataset.habitId = habit.id;
        
        // Build history dots
        let historyHtml = '';
        last7Days.forEach(date => {
            const isCompleted = habit.completedDates[date] || false;
            const isToday = date === today;
            const className = isCompleted ? 'completed' : (isToday ? '' : 'missed');
            const title = isToday ? 'Today' : date.slice(5);
            historyHtml += `<span class="history-dot ${className} ${isToday ? 'today' : ''}" title="${title}: ${isCompleted ? 'Completed' : (isToday ? 'Pending' : 'Missed')}"></span>`;
        });
        
        li.innerHTML = `
            <div class="habit-checkbox ${isCompletedToday ? 'completed' : ''}" onclick="toggleHabit('${habit.id}')" title="${isCompletedToday ? 'Mark incomplete' : 'Mark complete'}"></div>
            <div class="habit-info">
                <div class="habit-name">${escapeHtml(habit.name)}</div>
                <div class="habit-meta">
                    <span class="habit-streak ${streak >= 7 ? 'fire' : ''}">${streakEmoji} ${streak} day streak</span>
                </div>
            </div>
            <div class="habit-history">
                ${historyHtml}
            </div>
            <button class="delete-habit" onclick="deleteHabit('${habit.id}')" title="Delete habit">×</button>
        `;
        
        habitList.appendChild(li);
    });
    
    updateHabitStats();
}

function toggleHabit(habitId) {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;
    
    const today = getTodayString();
    const wasCompleted = habit.completedDates[today] || false;
    
    if (wasCompleted) {
        delete habit.completedDates[today];
        showNotification('Habit unchecked 💪', 'info');
    } else {
        habit.completedDates[today] = true;
        const streak = calculateStreak(habit);
        if (streak >= 7) {
            showNotification(`🔥 ${streak} day streak! Keep it up!`, 'success');
        } else {
            showNotification('Habit completed! Great job! ✅', 'success');
        }
    }
    
    saveData();
    loadHabits();
}

function addHabit() {
    const input = document.getElementById('newHabit');
    const habitName = input.value.trim();
    
    if (!habitName) {
        showNotification('Please enter a habit name first! 📝', 'error');
        return;
    }
    
    // Check for duplicates
    if (habits.some(h => h.name.toLowerCase() === habitName.toLowerCase())) {
        showNotification('Habit already exists! 🔄', 'error');
        return;
    }
    
    const newHabit = {
        id: `habit_${Date.now()}`,
        name: habitName,
        createdAt: Date.now(),
        completedDates: {}
    };
    
    habits.push(newHabit);
    saveData();
    
    input.value = '';
    loadHabits();
    
    showNotification('Habit added! Start your streak! 🚀', 'success');
}

function deleteHabit(habitId) {
    const habitEl = document.querySelector(`[data-habit-id="${habitId}"]`);
    if (habitEl) {
        habitEl.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            habits = habits.filter(h => h.id !== habitId);
            saveData();
            loadHabits();
        }, 300);
    }
}

function updateHabitStats() {
    const today = getTodayString();
    const completedToday = habits.filter(h => h.completedDates[today]).length;
    const totalHabits = habits.length;
    
    // Calculate current streak (streak of days where at least one habit was completed)
    let currentStreak = 0;
    const checkDate = new Date();
    
    while (true) {
        const dateStr = checkDate.toISOString().split('T')[0];
        const anyCompleted = habits.some(h => h.completedDates[dateStr]);
        
        if (anyCompleted || (dateStr === today && completedToday > 0)) {
            currentStreak++;
            checkDate.setDate(checkDate.getDate() - 1);
        } else {
            break;
        }
    }
    
    const currentStreakEl = document.getElementById('currentStreak');
    const completedTodayEl = document.getElementById('completedToday');
    
    if (currentStreakEl) {
        currentStreakEl.textContent = currentStreak;
        if (currentStreak >= 7) {
            currentStreakEl.classList.add('streak-fire');
        } else {
            currentStreakEl.classList.remove('streak-fire');
        }
    }
    
    if (completedTodayEl) {
        completedTodayEl.textContent = `${completedToday}/${totalHabits}`;
    }
}
