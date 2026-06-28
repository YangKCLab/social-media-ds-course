#!/usr/bin/env python3
"""
Validate versions configuration and directory structure
"""
import json
import sys
from pathlib import Path

# Canonical navigation keys and the content JSON each routed tab requires.
# `home` is intentionally absent: home.json is always required (semester
# metadata, not tab-gated).
NAV_KEYS = ['home', 'schedule', 'resources', 'staff']
NAV_FILE_MAP = {
    'schedule': 'schedule.json',
    'resources': 'resources.json',
    'staff': 'staff.json',
}


def normalize_navigation(nav):
    """Python mirror of normalizeNavigation() in
    frontend/src/composables/useConfig.js — keep the two in sync.

    Returns a dict keyed by NAV_KEYS, each {'enabled': bool, 'external': str|None}.
    A tab is enabled unless it explicitly sets enabled=false (so absent/partial
    entries default to visible); 'external' is the URL string or None.
    """
    nav = nav or {}
    result = {}
    for key in NAV_KEYS:
        entry = nav.get(key) or {}
        result[key] = {
            'enabled': entry.get('enabled') is not False,
            'external': entry.get('external') or None,
        }
    return result


def main():
    # Load config
    config_path = Path('versions/config.json')
    if not config_path.exists():
        print(f"Error: {config_path} not found")
        return 1

    with open(config_path) as f:
        config = json.load(f)

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

        # Required content files are derived from the navigation config:
        # home.json is always required, and each routed tab's JSON is required
        # only when that tab is enabled and not an external link (disabled or
        # external-only tabs have no internal page, so no JSON to validate).
        nav = normalize_navigation(version.get('navigation'))
        required_files = ['home.json']
        for tab, filename in NAV_FILE_MAP.items():
            if nav[tab]['enabled'] and not nav[tab]['external']:
                required_files.append(filename)

        for required_file in required_files:
            file_path = content_dir / required_file
            if not file_path.exists():
                errors.append(f"Missing {required_file} in {version_id}")

        # syllabus.pdf is compiled/copied manually, so its absence is a warning
        if not (content_dir / 'syllabus.pdf').exists():
            warnings.append(f"Missing syllabus.pdf in {version_id} (compile locally)")

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
