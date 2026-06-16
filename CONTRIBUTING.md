# Contributing to Lumi Dashboard

Thank you for your interest in contributing to Lumi Dashboard! 🎉

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/lumi-dashboard.git`
3. Open `index.html` in your browser to test changes

## Development Guidelines

### Code Style
- Use semantic HTML5 elements
- Follow CSS variable naming conventions (use `--` prefix)
- JavaScript: Use camelCase for variables and functions
- Keep functions small and focused

### Adding New Widgets

To add a new widget:

1. **HTML**: Add your widget markup to `index.html`:
```html
<div class="widget your-widget">
    <div class="widget-header">
        <span class="icon">🔧</span>
        <h3>Widget Name</h3>
    </div>
    <!-- Widget content -->
</div>
```

2. **CSS**: Add styles to `style.css`:
```css
.your-widget {
    /* Your styles */
}
```

3. **JavaScript**: Add functionality to `app.js`:
```javascript
// Your widget functions
```

### Pull Request Process

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make your changes
3. Test thoroughly in both light and dark themes
4. Commit with clear messages: `git commit -m "feat: add new widget"`
5. Push and create a PR

### Commit Message Format

Use conventional commits:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - CSS/styling changes
- `refactor:` - Code refactoring
- `test:` - Adding tests

## Testing

Before submitting:
- [ ] Test in Chrome/Edge
- [ ] Test in Firefox
- [ ] Test in Safari
- [ ] Test responsive layout (mobile)
- [ ] Verify both themes work
- [ ] Check PWA offline functionality

## Questions?

Open an issue for discussion before major changes.
