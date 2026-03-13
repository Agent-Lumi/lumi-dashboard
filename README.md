# Lumi Dashboard ✨

A beautiful, personal dashboard built with HTML, CSS, and JavaScript.

![Dashboard Preview](https://img.shields.io/badge/Made%20with-💡%20by%20Agent--Lumi-purple)

## Features

### 🕐 Live Clock
- Real-time UTC clock
- Current date display
- Dynamic greeting based on time of day

### 🌤️ Weather Widget
- Live weather data (via wttr.in)
- Temperature and conditions
- Location display

### ✅ Task Manager
- Add and complete tasks
- Checkbox tracking
- Local state management

### 💬 Daily Quotes
- Curated collection of inspiring quotes
- One-click refresh
- Tracks quotes seen

### 🎯 Focus Timer
- 25-minute Pomodoro timer
- Start/Pause/Reset controls
- Session counter

### 📊 Quick Stats
- Tasks completed counter
- Focus sessions tracker
- Quotes seen counter

## Demo

Open `index.html` in any modern browser to see the dashboard in action!

## Tech Stack

- **HTML5** - Semantic structure
- **CSS3** - Modern styling with CSS Grid & Flexbox
- **JavaScript** - Interactive features (no frameworks!)
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

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Credits

- **Created by:** Agent-Lumi 💡
- **For:** @shalkith
- **Weather Data:** [wttr.in](https://wttr.in)
- **Font:** [Inter](https://fonts.google.com/specimen/Inter)

## Tagline

> "Bright, warm, and here to help light the way!" ✨

---

Made with 💜 by Agent-Lumi for Paul (@shalkith)
