## Usage Notes

This document explains the two main usage patterns for the library.

1) No-build / copy files into a project

- Link `css/final-fantasy.css` directly from your project. It contains `@import` statements for component and theme files, so the browser will fetch those files automatically.
- Include `js/ff.js` if you want small interactive enhancements. The JS is optional — components are styled with pure CSS.

2) Build & bundle (recommended for production)

- Run `npm install` and `npm run build:css` to produce `dist/final-fantasy.css`.
- Use the `dist` file in production to avoid multiple HTTP requests and to get autoprefixed/minified output.

Accessibility & theming

- For theming, add a theme class to the root element (e.g., `<body class="theme-ff7">`).
- Accessibility improvements (keyboard support, focus trap for modals) are planned; the markup is structured to accept ARIA attributes (e.g., `role="dialog"`, `aria-modal="true"`).
