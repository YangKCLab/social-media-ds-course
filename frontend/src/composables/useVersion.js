import { computed } from 'vue'
import { useRoute } from 'vue-router'

// Keep in sync with router default to avoid undefined params during initial mount
const DEFAULT_VERSION = 'Fall2025'

/**
 * Normalize version string to canonical case by looking up in config
 * @param {string} versionInput - Version string from URL (any case)
 * @param {Array} versions - Array of version objects from config.json
 * @returns {string|null} Canonical version ID or null if not found
 */
export function normalizeVersion(versionInput, versions) {
  if (!versionInput || !versions || !Array.isArray(versions)) {
    return null
  }

  const inputLower = versionInput.toLowerCase()

  // First try exact match (fast path for already-correct URLs)
  const exactMatch = versions.find(v => v.id === versionInput)
  if (exactMatch) {
    return exactMatch.id
  }

  // Case-insensitive lookup
  const caseInsensitiveMatch = versions.find(v =>
    v.id.toLowerCase() === inputLower
  )

  return caseInsensitiveMatch ? caseInsensitiveMatch.id : null
}

/**
 * Composable for managing version-aware data loading
 * @returns {Object} Version context and helpers
 */
export function useVersion() {
  const route = useRoute()

  // Get current version from route params
  const currentVersion = computed(() => route.params.version || DEFAULT_VERSION)

  /**
   * Load version-specific data file
   * @param {string} filename - Name of the JSON file to load
   * @returns {Promise<Object>} Parsed JSON data
   */
  const loadVersionData = async (filename) => {
    const version = currentVersion.value || DEFAULT_VERSION
    const url = `${import.meta.env.BASE_URL}versions/${version}/content/${filename}`

    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Failed to load ${filename} for version ${version} (HTTP ${response.status})`)
      }
      return response.json()
    } catch (error) {
      console.error(`Error loading ${url}:`, error)
      throw error
    }
  }

  return {
    currentVersion,
    loadVersionData
  }
}
