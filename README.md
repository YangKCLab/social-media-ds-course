# CS 415/515 Social Media Data Science Pipelines

This repository contains course materials for the CS 415/515 Social Media Data Science Pipelines course, taught by Kai-Cheng Yang at Binghamton University.

## Repository Structure

The repository is organized to support multiple semester iterations:

- `frontend/` - Vue.js course website
- `versions/` - Semester-specific course content (schedule, resources, demos, etc.)
- `syllabus/` - LaTeX source for course syllabus (compiled locally)
- `scripts/` - Build and maintenance scripts
- `demos/` - Master copy of Jupyter notebook demonstrations

## Quick Start

### View the Course Website

Visit: https://yangkclab.github.io/social-media-ds-course/

### Development

```bash
# Install frontend dependencies
cd frontend
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### Creating a New Semester

```bash
# Create semester from template
make new-semester SEMESTER=Spring2026

# Update versions/config.json with new semester info
# Edit content files in versions/Spring2026/
# Copy demos and compile syllabus

# Validate configuration
make validate-versions
```

## Semester Versioning

Each semester has its own directory under `versions/` containing:

- `content/` - JSON data files and syllabus PDF
- `demos/` - Jupyter notebook demonstrations

The website automatically routes to version-specific content (e.g., `/Fall2025/`, `/Spring2026/`).

See [`versions/README.md`](versions/README.md) for detailed instructions on managing semester versions.

## Course Information

- **Instructor**: [Kai-Cheng Yang](https://www.kaichengyang.me/kaicheng)
- **Topics**: Data science techniques for large-scale social media, data collection and management, exploratory analysis, visualization, hypothesis testing, and real-time analytics
