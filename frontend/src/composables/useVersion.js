import { computed } from 'vue'
import { useRoute } from 'vue-router'

// Keep in sync with router default to avoid undefined params during initial mount
const DEFAULT_VERSION = 'Fall2025'

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
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to load ${filename} for version ${version}`)
    }
    return response.json()
  }

  return {
    currentVersion,
    loadVersionData
  }
}
