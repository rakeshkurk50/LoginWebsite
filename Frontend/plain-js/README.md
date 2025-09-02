Plain JS / jQuery version of the User Registration app

What this is:
- A lightweight, plain-HTML + jQuery implementation of the existing React/Tailwind app.
- Keeps the same UI structure, validation rules, and uses localStorage to persist registered users.

Files:
- index.html — registration form
- display.html — list & delete users
- app.js — validation, storage, and UI behavior (jQuery)
- styles.css — tiny styles to match the original look

How to run:
1. Open `plain-js/index.html` in your browser (double-click or use "Open File...").
2. Register users; they are saved to localStorage.
3. Click "View Registered Users" or open `plain-js/display.html` to see entries.

Notes and next steps:
- This is a minimal migration. It intentionally avoids build tools.
- If you'd like, I can wire this into the project root, add a small static server script, or convert the UI helpers (cards, buttons) into reusable HTML/CSS partials.

Quick visual customization
- To use a custom background image, place a file named `bg.jpg` inside this folder (`plain-js/bg.jpg`). The CSS falls back to a gradient if the image is missing.
- To preview the pages locally, run a small static server (Python or Node) from this folder and open `index.html`, `login.html` or `display.html`.
