# Course Versions Directory

This directory contains semester-specific course content. Each semester has its own subdirectory with all course materials.

## Directory Structure

```
versions/
├── config.json              # Version registry and default version
├── Fall2025/                # Example semester
│   ├── content/
│   │   ├── schedule.json    # Course schedule
│   │   ├── resources.json   # Course resources
│   │   ├── staff.json       # Instructor and TA info
│   │   ├── home.json        # Semester metadata
│   │   └── syllabus.pdf     # Compiled syllabus (add manually)
│   └── demos/               # Demo notebooks
│       ├── 4chan/
│       ├── bluesky/
│       ├── youtube/
│       └── ...
└── _template/               # Template for new semesters
```

## Adding a New Semester

1. Create new semester from template:
   ```bash
   make new-semester SEMESTER=Spring2026
   ```

2. Update `config.json` to add the new version:
   ```json
   {
     "id": "Spring2026",
     "displayName": "Spring 2026",
     "path": "Spring2026",
     "active": true,
     "semester": "Spring",
     "year": 2026,
     "navigation": {
       "home": true,
       "schedule": true,
       "resources": false,
       "staff": true
     }
   }
   ```

   **Note**: The `navigation` field is optional. If omitted, all tabs are shown by default. Set a tab to `false` to hide it for this version.

3. Edit the content files in `versions/Spring2026/content/`:
   - `home.json` - Update semester name, class time, location
   - `staff.json` - Update instructor and TA information
   - `schedule.json` - Add course schedule
   - `resources.json` - Add/update resources

4. Copy demo notebooks:
   ```bash
   cp -r demos/* versions/Spring2026/demos/
   ```

5. Compile syllabus locally and copy to version:
   ```bash
   cd syllabus && make
   make copy-syllabus VERSION=Spring2026
   ```

6. Validate the configuration:
   ```bash
   make validate-versions
   ```

## Updating the Default Version

Edit `config.json` and change the `defaultVersion` field:

```json
{
  "defaultVersion": "Spring2026",
  "versions": [...]
}
```

The default version will be shown when users visit the root URL.

## File Descriptions

### config.json
- `defaultVersion`: The version shown at the root URL
- `versions`: Array of version objects with metadata
  - `id`: Internal identifier (used in URLs)
  - `displayName`: Human-readable name shown in UI
  - `path`: URL path segment
  - `active`: Whether this version is currently active
  - `semester`: Semester name (Fall, Spring, Summer)
  - `year`: Year
  - `navigation` (optional): Configure which navigation tabs to show
    - `home`: Show Home tab (default: true)
    - `schedule`: Show Schedule tab (default: true)
    - `resources`: Show Resources tab (default: true)
    - `staff`: Show Staff tab (default: true)

### content/home.json
Semester-specific metadata displayed on the home page:
- `semester`: Display name (e.g., "Fall 2025")
- `classTime`: Meeting times
- `location`: Classroom location
- `grading`: Grading breakdown
- `gradingScale`: Letter grade cutoffs

### content/staff.json
Staff information:
- `instructor`: Instructor details (name, email, office, hours)
- `tas`: Array of TA objects

### content/schedule.json
Course schedule as array of objects with:
- `week`: Week number
- `date`: Date (M/D/Y format)
- `lectureTopic`: Lecture topic
- `readingTopic`: Reading topic
- `materials`: Array of reading materials
- `project`: Project milestone information

### content/resources.json
Course resources organized in sections:
- `sections`: Array of resource sections
  - `title`: Section title
  - `description`: Section description
  - `resources`: Array of resource links

## Notes

- The `syllabus/` directory in the project root contains LaTeX source files (not versioned)
- Compile syllabus locally and use `make copy-syllabus VERSION=<version>` to deploy
- All versions remain editable after the semester ends
- The frontend automatically loads version-specific content based on the URL
