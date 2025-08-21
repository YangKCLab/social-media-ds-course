# Repository Guidelines

## Project Structure & Module Organization
- `frontend/`: Vue 3 + Vite app for the course site (deployed via GitHub Pages). Key files: `src/pages/*.vue`, `src/router/`, `public/schedule.json`.
- `syllabus/`: LaTeX source (`syllabus.tex`, `Makefile`) to build the course syllabus PDF.
- `.github/workflows/`: CI for Pages deploy (`deploy-frontend.yml`).

## Build, Test, and Development Commands
- Frontend
  - `cd frontend && npm run dev`: Start local dev server.
  - `cd frontend && npm run build`: Production build to `frontend/dist`.
  - `cd frontend && npm run preview`: Serve the built site locally.
- Syllabus
  - `cd syllabus && make` or `latexmk -pdf syllabus.tex`: Build `syllabus.pdf`.
- Deployment
  - Push to `main` to auto‑deploy Pages. Vite `base` is set to `/social-media-ds-course/` in `frontend/vite.config.js`.

## Coding Style & Naming Conventions
- Frontend
  - Use Vue SFCs with `<script setup>` and ES modules.
  - Indentation: 2 spaces; keep components small and focused.
  - Routes: add pages under `src/pages/` and register in `src/router/index.js`.
  - Styles: Prefer Bootstrap 5 utility classes; minimal custom CSS in `src/style.css` or scoped styles.
- Syllabus
  - Keep logical sections; avoid ad‑hoc formatting. Use existing macros/styles.

## Testing Guidelines
- No formal test suite configured. Manually verify:
  - Frontend builds and routes work (`/`, `/schedule`, `/resources`, `/staff`).
  - JSON data (`public/schedule.json`) loads and renders correctly.
- Optional: add Vitest/component tests under `frontend/` following `*.spec.ts` naming.

## Commit & Pull Request Guidelines
- Commit messages follow Conventional Commits (e.g., `feat(frontend): ...`, `fix(schedule): ...`, `docs(...): ...`, `chore(...): ...`, `ci(...): ...`). Keep changes scoped and descriptive.
- Branch naming: `feature/...`, `fix/...`, `chore/...`.
- Pull Requests
  - Provide a clear title/summary, scope of changes, and screenshots/links (e.g., `/schedule`).
  - Keep PRs small; prefer squash merges. Reference related issues when applicable.

## Agent Tips & Notes
- Updating schedule: edit `frontend/public/schedule.json` (supports nested `project` metadata) and verify via `npm run dev`.
- Syllabus is the source of truth for policies; link it from the homepage when updated.
