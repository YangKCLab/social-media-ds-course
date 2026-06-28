---
description: 
alwaysApply: true
---

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository contains course materials for CS 415/515 Social Media Data Science Pipelines, taught by Kai-Cheng Yang at Binghamton University. The repository is structured to support multiple semester iterations with version-specific content.

## Architecture

### Frontend (`/frontend/`)
- **Technology**: Vue 3 + Vite + Vue Router
- **Purpose**: Course website with dynamic version-aware routing
- **Styling**: Bootstrap 5 loaded via CDN with minimal custom CSS
- **Data Sources**: Version-specific JSON files loaded from `/versions/{semester}/content/`
- **Structure**: Single-page application with composable-based version management
- **Routing**: Dynamic routes with version parameter (e.g., `/Fall2025/`, `/Spring2026/`)

### Versions (`/versions/`)
- **Purpose**: Semester-specific course content
- **Structure**: Each semester has its own directory with `content/` and `demos/` subdirectories
- **Config**: `config.json` defines available versions and default version
- **Content Files**:
  - `schedule.json` - Course schedule
  - `resources.json` - Course resources and links
  - `staff.json` - Instructor and TA information
  - `home.json` - Semester metadata (dates, grading, location)
  - `syllabus.pdf` - Compiled syllabus (copied manually from the internal repo)

### Syllabus
- **Source**: LaTeX source lives in the private `social-media-ds-course-internal` repo (`syllabus/` folder)
- **Deployment**: After building the PDF in the internal repo, copy it here with `make copy-syllabus`
- **Note**: The `syllabus.pdf` in `versions/<VERSION>/content/` is the deployed artifact; the LaTeX source is not in this repo

### Demos (`/demos/`)
- **Purpose**: Master copy of Jupyter notebook demonstrations
- **Content**: Platform-specific demos (BlueSky, 4chan, YouTube) and technique demos (stats, network, visualization)
- **Versioning**: Copied to each semester's `versions/{semester}/demos/` directory

## Common Development Commands

### Frontend Development
```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Version Management
```bash
# Create new semester
make new-semester SEMESTER=Spring2026

# Build syllabus PDF in internal repo first, then copy it here:
make copy-syllabus VERSION=Fall2025 SYLLABUS_PDF=../social-media-ds-course-internal/syllabus/syllabus.pdf

# Validate version configuration
make validate-versions

# Build frontend
make build-frontend
```

## Key Files and Structure

### Frontend
- `frontend/src/App.vue`: Main application shell with navigation and version switcher
- `frontend/src/router/index.js`: Dynamic routing configuration with version parameter
- `frontend/src/composables/useVersion.js`: Version context composable
- `frontend/src/pages/`: Individual page components (Home, Schedule, Resources, Staff)
- `frontend/vite.config.js`: Build configuration with version directory copying

### Versions
- `versions/config.json`: Version registry, default version, and navigation configuration
- `versions/Fall2025/content/*.json`: Semester-specific data files
- `versions/Fall2025/demos/`: Semester-specific demo notebooks
- `versions/_template/`: Template for new semesters

**Navigation Configuration**: Each version in `config.json` can optionally specify which navigation tabs to show:
```json
"navigation": {
  "home": true,
  "schedule": true,
  "resources": false,  // Hide Resources tab for this version
  "staff": true
}
```
If the `navigation` field is omitted, all tabs are shown by default.

### Build System
- `Makefile`: Root-level build targets
- `scripts/new-semester.sh`: Create new semester from template
- `scripts/validate-versions.py`: Validate version configuration
- `.github/workflows/deploy-frontend.yml`: GitHub Actions deployment

## Development Notes

- The frontend dynamically loads content based on the version in the URL
- Each semester is independent with its own data files and demos
- The syllabus is built in the `social-media-ds-course-internal` repo and the compiled PDF is manually copied to version directories here
- Bootstrap 5 handles most frontend styling; custom CSS is minimal
- Version URLs follow the pattern: `/{version}/` (e.g., `/Fall2025/`, `/Spring2026/`)
- The root URL (`/`) redirects to the default version specified in `versions/config.json`

## Python environment

This project uses uv to manage the virtual environment.

Use the following command to install the dependencies:

```bash
uv sync
```
Use the following command to run Python scripts:

```bash
uv run script.py
```
