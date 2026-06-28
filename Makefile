# Default path to compiled syllabus PDF (built in the internal repo)
SYLLABUS_PDF ?= ../social-media-ds-course-internal/syllabus/syllabus.pdf

.PHONY: copy-syllabus
copy-syllabus:
ifndef VERSION
	@echo "Error: VERSION not specified"
	@echo "Usage: make copy-syllabus VERSION=Fall2025"
	@echo "       make copy-syllabus VERSION=Fall2025 SYLLABUS_PDF=/path/to/syllabus.pdf"
	@exit 1
endif
	@if [ ! -f "$(SYLLABUS_PDF)" ]; then \
		echo "Error: syllabus PDF not found at: $(SYLLABUS_PDF)"; \
		echo "Build it first: cd <internal-repo>/syllabus && make"; \
		exit 1; \
	fi
	@echo "Copying syllabus PDF to versions/$(VERSION)/content/..."
	@cp $(SYLLABUS_PDF) versions/$(VERSION)/content/syllabus.pdf
	@echo "✓ Copied syllabus.pdf to versions/$(VERSION)/content/"
	@echo "Remember to git add and commit the updated PDF"

.PHONY: build-frontend
build-frontend:
	@echo "Building frontend..."
	@cd frontend && npm run build
	@echo "✓ Frontend built to frontend/dist/"

.PHONY: new-semester
new-semester:
ifndef SEMESTER
	@echo "Error: SEMESTER not specified"
	@echo "Usage: make new-semester SEMESTER=Spring2026"
	@exit 1
endif
	@./scripts/new-semester.sh $(SEMESTER)

.PHONY: validate-versions
validate-versions:
	@echo "Validating versions..."
	@uv run scripts/validate-versions.py

.PHONY: help
help:
	@echo "Available targets:"
	@echo "  copy-syllabus VERSION=<version>  - Copy compiled syllabus PDF to version directory"
	@echo "                                     Syllabus is built in the internal repo (social-media-ds-course-internal)"
	@echo "                                     Default source: ../social-media-ds-course-internal/syllabus/syllabus.pdf"
	@echo "                                     Override with SYLLABUS_PDF=/path/to/syllabus.pdf"
	@echo "  build-frontend                   - Build Vue frontend"
	@echo "  new-semester SEMESTER=<name>     - Create new semester from template"
	@echo "  validate-versions                - Validate version configuration"
	@echo ""
	@echo "Examples:"
	@echo "  make copy-syllabus VERSION=Fall2025"
	@echo "  make copy-syllabus VERSION=Fall2025 SYLLABUS_PDF=../social-media-ds-course-internal/syllabus/syllabus.pdf"
	@echo "  make new-semester SEMESTER=Spring2026"
	@echo "  make build-frontend"
