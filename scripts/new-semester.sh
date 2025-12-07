#!/bin/bash
# Create a new semester from template

set -e

if [[ $# -ne 1 ]]; then
  echo "Usage: $0 <semester-name>"
  echo "Example: $0 Spring2026"
  exit 1
fi

SEMESTER=$1
TEMPLATE_DIR="versions/_template"
TARGET_DIR="versions/$SEMESTER"

# Check if template exists
if [[ ! -d "$TEMPLATE_DIR" ]]; then
  echo "Error: Template directory not found: $TEMPLATE_DIR"
  exit 1
fi

# Check if semester already exists
if [[ -d "$TARGET_DIR" ]]; then
  echo "Error: Semester directory already exists: $TARGET_DIR"
  exit 1
fi

echo "Creating new semester: $SEMESTER"
cp -r "$TEMPLATE_DIR" "$TARGET_DIR"

echo "✓ Created $TARGET_DIR"
echo ""
echo "Next steps:"
echo "1. Update versions/config.json to add the new semester"
echo "2. Edit $TARGET_DIR/content/*.json files with semester-specific data"
echo "3. Copy demo notebooks to $TARGET_DIR/demos/"
echo "4. Compile syllabus locally and run: make copy-syllabus VERSION=$SEMESTER"
echo ""
echo "Example config.json entry:"
echo '  {'
echo '    "id": "'$SEMESTER'",'
echo '    "displayName": "Spring 2026",'
echo '    "path": "'$SEMESTER'",'
echo '    "active": true,'
echo '    "semester": "Spring",'
echo '    "year": 2026,'
echo '    "navigation": {'
echo '      "home": true,'
echo '      "schedule": true,'
echo '      "resources": true,'
echo '      "staff": true'
echo '    }'
echo '  }'
echo ''
echo 'Note: Set navigation tabs to false to hide them (e.g., "resources": false)'
