# Course Demos

This directory contains practical demonstrations and examples for CS 415/515 Social Media Data Science Pipelines.

## Prerequisites

This project uses [uv](https://github.com/astral-sh/uv) for Python dependency management and virtual environment handling. Make sure you have uv installed:

```bash
# Install uv (if not already installed)
curl -LsSf https://astral.sh/uv/install.sh | sh
```

## Setup

Before running any demos, set up the Python environment:

```bash
# Navigate to the project root
cd /path/to/social-media-ds-course

# Install dependencies and create virtual environment
uv sync
```

## Running Demos

### General Usage

To run any Python demo script:

```bash
# From the project root directory
uv run demos/path/to/demo_script.py
```

### Available Demos

- **Bluesky Demo** (`bluesky/`): Social media data collection and analysis examples using the Bluesky platform

### Jupyter Notebooks

If demos include Jupyter notebooks, you can run them with:

```bash
uv run --with jupyter jupyter notebook
```

## Troubleshooting

- **Import errors**: Ensure you're running scripts with `uv run` from the project root
- **Missing dependencies**: Run `uv sync` to install all required packages
- **Python version issues**: Check `.python-version` file (currently set to Python 3.12)
