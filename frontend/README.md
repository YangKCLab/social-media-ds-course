# Frontend — Course Page (Vue + Vite)

This directory contains a simple Vue 3 + Vite app for the course website.
The landing page (`src/App.vue`) is modeled after the AI Agents course template and customized for
CS 415/515 Social Media Data Science Pipelines.

## Scripts

- `npm run dev` — Start dev server.
- `npm run build` — Build for production (`dist/`).
- `npm run preview` — Preview the production build locally.

## Structure

- `index.html` — App shell, loads Bootstrap 5 from CDN.
- `src/App.vue` — Main course page content and sections.
- `src/style.css` — Minimal global styles (Bootstrap handles most layout).

## Notes

- Source of truth for detailed policies remains the LaTeX syllabus in `../syllabus/`.
- If deploying to GitHub Pages under a subpath, configure `base` in `vite.config.js`.
