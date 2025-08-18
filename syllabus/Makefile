# Makefile for LaTeX syllabus compilation

# Variables
TEX_FILE = syllabus.tex
PDF_FILE = syllabus.pdf

# Default target
all: $(PDF_FILE)

# Compile PDF from LaTeX source
$(PDF_FILE): $(TEX_FILE)
	latexmk -pdf $(TEX_FILE)


# Clean intermediate files
clean:
	latexmk -c $(TEX_FILE)

distclean:
	latexmk -C $(TEX_FILE)

# Show help
help:
	@echo "Available targets:"
	@echo "  all      - Compile the PDF (default)"
	@echo "  clean    - Remove intermediate LaTeX files"
	@echo "  distclean- Remove all generated files including PDF"
	@echo "  help     - Show this help message"

# Declare phony targets
.PHONY: all clean help