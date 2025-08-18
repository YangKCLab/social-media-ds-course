# Course Syllabus

This directory contains the syllabus for CS 415/515 Social Media Data Science Pipelines.

## Files

- `syllabus.tex` - LaTeX source file for the course syllabus
- `syllabus.pdf` - Compiled PDF version of the syllabus
- `memoir-article-styles.sty` - Custom LaTeX style file for document formatting
- `org-preamble-pdflatex.sty` - LaTeX preamble with common packages and settings

## Building the Syllabus

### Using Make (Recommended)

```bash
make          # Compile the PDF (double-pass for proper formatting)
make quick    # Quick single-pass compilation
make clean    # Remove intermediate files
make distclean # Remove all generated files including PDF
make help     # Show available targets
```

### Manual Compilation

To compile the syllabus from source:

```bash
pdflatex syllabus.tex
```

Or use latexmk for automated compilation:

```bash
latexmk -pdf syllabus.tex
```

## Course Information

- **Course**: CS 415/515 Social Media Data Science Pipelines
- **Instructor**: Kai-Cheng Yang
- **Institution**: Binghamton University
- **Topics**: Social Media, Data Science

The syllabus is based on Kieran Healy's LaTeX syllabus templates and follows academic formatting standards.