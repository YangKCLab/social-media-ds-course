.PHONY: copy-syllabus
copy-syllabus:
	@echo "Copying syllabus PDF to frontend..."
	@cp syllabus/syllabus.pdf frontend/public/syllabus.pdf
	@echo "✓ Copied syllabus.pdf to frontend/public/"
	@echo "Remember to git add and commit the updated PDF"

.PHONY: help
help:
	@echo "Available targets:"
	@echo "  copy-syllabus  - Copy syllabus PDF to frontend/public/"
	@echo ""
	@echo "Usage: make copy-syllabus"
