# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository contains course materials for CS 415/515 Social Media Data Science Pipelines, taught by Kai-Cheng Yang at Binghamton University. It consists of two main components: a Vue.js frontend for the course website and LaTeX source files for the course syllabus.

## Architecture

The repository is organized into two primary components:

### Frontend (`/frontend/`)
- **Technology**: Vue 3 + Vite + Vue Router
- **Purpose**: Course website with navigation between sections (Home, Schedule, Resources, Staff)
- **Styling**: Bootstrap 5 loaded via CDN with minimal custom CSS
- **Data Sources**: Static JSON files in `public/` directory for resources and schedule data
- **Structure**: Single-page application with component-based architecture

### Syllabus (`/syllabus/`)
- **Technology**: LaTeX with custom style packages
- **Purpose**: Official course syllabus document generation
- **Dependencies**: Uses `memoir-article-styles.sty` and `org-preamble-pdflatex.sty` for formatting
- **Build System**: Makefile with latexmk for automated compilation

## Common Development Commands

### Frontend Development
```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Syllabus Compilation
```bash
cd syllabus
make                 # Compile PDF (recommended)
make clean          # Remove intermediate files
make distclean      # Remove all generated files
make help           # Show available targets
```

### Alternative LaTeX compilation
```bash
cd syllabus
latexmk -pdf syllabus.tex    # Direct compilation
pdflatex syllabus.tex        # Manual compilation
```

## Key Files and Structure

- `frontend/src/App.vue`: Main application shell with navigation
- `frontend/src/pages/`: Individual page components (Home, Schedule, Resources, Staff)
- `frontend/public/resources.json`: Course resources data
- `frontend/public/schedule.json`: Course schedule data
- `syllabus/syllabus.tex`: LaTeX source for course syllabus
- `syllabus/syllabus.pdf`: Generated syllabus document

## Development Notes

- The frontend serves as a course website interface, not a complex web application
- The syllabus directory contains the authoritative course policies and information
- Bootstrap 5 handles most frontend styling; custom CSS is minimal
- JSON files in `public/` should be updated for course content changes
- LaTeX compilation requires a working LaTeX distribution with latexmk