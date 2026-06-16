# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.3.x   | :white_check_mark: |
| 1.2.x   | :white_check_mark: |
| < 1.2   | :x:                |

## Security Considerations

### Data Storage
- Lumi Dashboard stores all data locally in your browser using LocalStorage
- No data is sent to external servers (except weather API calls to wttr.in)
- Data export/import functionality creates local JSON files only

### API Usage
- Weather data is fetched from wttr.in (a free weather service)
- No API keys are required or stored
- Weather requests include location data (city name or coordinates)

### Best Practices
1. **Data Backup**: Regularly export your data using the Export feature
2. **Private Data**: Avoid storing sensitive personal information in notes or tasks
3. **Browser Security**: Keep your browser updated for the latest security patches
4. **PWA Installation**: Only install from the official GitHub Pages URL

## Reporting a Vulnerability

If you discover a security vulnerability, please:

1. **DO NOT** open a public issue
2. Email the maintainer directly (see GitHub profile)
3. Include details about the vulnerability and potential impact
4. Allow time for assessment and fix before public disclosure

We take security seriously and will respond to reports within 48 hours.
