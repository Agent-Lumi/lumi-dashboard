# Lumi Dashboard ✨

A beautiful, personal dashboard built with HTML, CSS, and JavaScript.

![Dashboard Preview](https://img.shields.io/badge/Made%20with-💡%20by%20Agent--Lumi-purple)

## 🚀 Live Demo

**[👉 View Live Demo](https://agent-lumi.github.io/lumi-dashboard/)**

Or clone and open `index.html` locally.

## Features

### ✨ Widget Animations (NEW!)
- **Smooth entrance animations** for all widgets on page load
- **Staggered animations** create a cascading effect
- **Hover lift effects** with subtle scale
- **List item animations** for tasks, notes, and habits
- **Focus glow effects** when interacting with widgets

### 🧮 Calculator with Keyboard Support (NEW!)
- **Full keyboard support** - use number keys and operators
- **Press Enter** to calculate
- **Press C or Escape** to clear
- **Backspace** to delete last digit
- Visual button feedback when using keyboard
- Calculator keyboard shortcuts:
  - `0-9` - Input numbers
  - `+` `-` `*` `/` - Operators
  - `Enter` or `=` - Calculate
  - `.` - Decimal point
  - `C` or `Esc` - Clear
  - `Backspace` - Delete last digit

### 📱 PWA Support
- **Install as a native app** on mobile/desktop
- **Works offline** - all features available without internet
- **Automatic updates** - service worker keeps app fresh
- **Home screen icon** - quick access like any native app
- **Offline indicator** - shows when you're offline
- **Background sync** ready for future enhancements
- **Ctrl+Shift+R** - Check for updates manually

### 📝 Quick Notes Widget
- Add quick text notes on the fly
- **💾 Auto-saves to LocalStorage**
- Timestamps on each note
- Delete individual notes or clear all
- Enter to save, Shift+Enter for new line
- Beautiful purple accent styling

### 🕐 Live Clock
- Real-time **Arizona time** (MST/MDT)
- Current date display
- Dynamic greeting based on time of day

### 🌤️ Weather Widget
- Live weather data (via wttr.in)
- **Fahrenheit** temperature display
- Phoenix, Arizona location
- Manual refresh button
- **Offline fallback** - cached weather data

### ✅ Task Manager
- Add and complete tasks
- **💾 Saves to LocalStorage** - persists between visits!
- Delete tasks with hover button
- Keyboard shortcuts for quick task entry

### 💬 Daily Quotes
- Curated collection of inspiring quotes
- One-click refresh
- Tracks quotes seen

### 🌗 Theme Toggle
- **Dark/Light mode** switch (☀️/🌙 button)
- Smooth transitions between themes
- Preference saved in LocalStorage

### 🎯 Focus Timer
- 25-minute Pomodoro timer
- Start/Pause/Reset controls
- **Space bar** to start/pause
- Session counter
- Audio notification when complete

### 📊 Quick Stats
- Tasks completed counter
- Focus sessions tracker
- Quotes seen counter
- **Data export/import** functionality
- **Data reset** option

### ⌨️ Keyboard Shortcuts
| Shortcut | Action |
|----------|--------|
| `Space` | Start/Pause timer |
| `Ctrl/Cmd + T` | Focus task input |
| `Ctrl/Cmd + R` | Refresh quote |
| `Ctrl/Cmd + W` | Refresh weather |
| `Ctrl/Cmd + D` | Toggle theme |
| `Ctrl/Cmd + Shift + R` | Check for PWA updates |
| `Esc` | Pause timer & blur input |

### 🧮 Calculator Keyboard Shortcuts
| Shortcut | Action |
|----------|--------|
| `0-9` | Input numbers |
| `+` `-` `*` `/` | Operators |
| `Enter` or `=` | Calculate |
| `.` | Decimal point |
| `C` or `Esc` | Clear |
| `Backspace` | Delete last digit |

### 🔔 Notifications
- Toast notifications for actions
- Visual feedback for data operations
- Error handling with user-friendly messages

## Demo

Open `index.html` in any modern browser to see the dashboard in action!

## Installation (PWA)

### Desktop (Chrome/Edge)
1. Visit the [live demo](https://agent-lumi.github.io/lumi-dashboard/)
2. Click the install icon (➕) in the address bar
3. Or click the "Install App" button in the dashboard

### Mobile (iOS Safari)
1. Open the dashboard in Safari
2. Tap the Share button
3. Tap "Add to Home Screen"

### Mobile (Android Chrome)
1. Open the dashboard in Chrome
2. Tap the menu (⋮)
3. Tap "Add to Home Screen"

Once installed, the app works **completely offline**!

## Tech Stack

- **HTML5** - Semantic structure
- **CSS3** - Modern styling with CSS Grid & Flexbox
- **JavaScript** - Interactive features (no frameworks!)
- **Service Worker** - PWA offline support
- **Web App Manifest** - Installable app configuration
- **Inter Font** - Clean, modern typography

## Design

- 🌙 Dark theme with purple accents
- ✨ Subtle animations and hover effects
- 📱 Fully responsive (mobile-friendly)
- 🎨 Glass-morphism inspired cards
- 💡 Lumi branding throughout

## Usage

1. Clone the repository
2. Open `index.html` in your browser
3. Enjoy your personal dashboard!

```bash
git clone https://github.com/Agent-Lumi/lumi-dashboard.git
cd lumi-dashboard
# Open index.html in browser
```

## Customization

### Adding More Quotes
Edit the `quotes` array in `app.js`:

```javascript
const quotes = [
    { text: "Your quote here", author: "Author Name" },
    // ... more quotes
];
```

### Changing Location for Weather
Modify the `fetchWeather()` function in `app.js` to use your city:

```javascript
const response = await fetch('https://wttr.in/YourCity?format=j1');
```

## Browser Support

- Chrome/Edge (latest) - Full PWA support
- Firefox (latest) - PWA support (desktop)
- Safari (latest) - Add to Home Screen support
- Mobile browsers - Full PWA support

## PWA Features

- **Service Worker**: Caches assets for offline use
- **Web App Manifest**: Configures app appearance
- **Offline Fallback**: Shows cached data when offline
- **Background Sync**: Ready for future enhancements
- **Push Notifications**: Framework ready

## Version History

- **v1.3** (Current) - Calculator keyboard support, widget animations, visual enhancements
- **v1.2** - Habit tracker widget, Pomodoro timer modes
- **v1.1** - Quick notes widget, calculator widget, keyboard shortcuts widget
- **v1.0** - Initial release with tasks, weather, quotes, focus timer, and PWA support

## Credits

- **Created by:** Agent-Lumi 💡
- **For:** @shalkith
- **Weather Data:** [wttr.in](https://wttr.in)
- **Font:** [Inter](https://fonts.google.com/specimen/Inter)

## Tagline

> "Bright, warm, and here to help light the way!" ✨

---

Made with 💜 by Agent-Lumi for Paul (@shalkith)
