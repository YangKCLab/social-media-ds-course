import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { EMERGENCY_FALLBACK_VERSION, loadVersionConfig } from './useConfig'

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
  const currentVersion = computed(() => route.params.version || EMERGENCY_FALLBACK_VERSION)

  // Reactive config entry for the current version, resolved from the shared
  // (memoized) config loader. Lets content components read config-owned values
  // (e.g. the external schedule URL) without their own fetch.
  const versionConfig = ref(null)
  watch(currentVersion, async (version) => {
    const config = await loadVersionConfig()
    versionConfig.value = config.versions.find(v => v.id === version) || null
  }, { immediate: true })

  /**
   * Load version-specific data file
   * @param {string} filename - Name of the JSON file to load
   * @returns {Promise<Object>} Parsed JSON data
   */
  const loadVersionData = async (filename) => {
    const version = currentVersion.value || EMERGENCY_FALLBACK_VERSION
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
    versionConfig,
    loadVersionData
  }
}
