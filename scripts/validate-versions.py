#!/usr/bin/env python3
"""
Validate versions configuration and directory structure
"""
import json
import sys
from pathlib import Path

def main():
    # Load config
    config_path = Path('versions/config.json')
    if not config_path.exists():
        print(f"Error: {config_path} not found")
        return 1

    with open(config_path) as f:
        config = json.load(f)

    required_files = ['schedule.json', 'resources.json', 'staff.json', 'home.json', 'syllabus.pdf']
    errors = []
    warnings = []

    # Validate default version exists
    default_version = config.get('defaultVersion')
    if not default_version:
        errors.append("No defaultVersion specified in config.json")

    # Check each version
    for version in config.get('versions', []):
        version_id = version.get('id')
        if not version_id:
            errors.append(f"Version missing 'id' field: {version}")
            continue

        version_dir = Path(f'versions/{version_id}')

        # Check directory exists
        if not version_dir.exists():
            errors.append(f"Directory not found for version: {version_id}")
            continue

        # Check content directory
        content_dir = version_dir / 'content'
        if not content_dir.exists():
            errors.append(f"Content directory not found: {content_dir}")
            continue

        # Check required files
        for required_file in required_files:
            file_path = content_dir / required_file
            if not file_path.exists():
                if required_file == 'syllabus.pdf':
                    warnings.append(f"Missing {required_file} in {version_id} (compile locally)")
                else:
                    errors.append(f"Missing {required_file} in {version_id}")

        # Check demos directory
        demos_dir = version_dir / 'demos'
        if not demos_dir.exists():
            warnings.append(f"Demos directory not found: {demos_dir}")

    # Print results
    if errors:
        print("❌ Validation failed with errors:")
        for error in errors:
            print(f"  - {error}")

    if warnings:
        print("\n⚠️  Warnings:")
        for warning in warnings:
            print(f"  - {warning}")

    if not errors and not warnings:
        print("✓ All versions validated successfully")
        return 0
    elif not errors:
        print("\n✓ Validation passed (with warnings)")
        return 0
    else:
        return 1

if __name__ == '__main__':
    sys.exit(main())
