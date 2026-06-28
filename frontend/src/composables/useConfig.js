// Single source of truth for version configuration.
//
// Centralizes the `versions/config.json` fetch (memoized so every consumer
// shares one network request) and the logic for resolving the default version.
// This is the ONLY place a version literal is hardcoded in the codebase, and it
// is used solely as an emergency fallback when config.json fails to load.

export const EMERGENCY_FALLBACK_VERSION = 'Fall2026'

let configPromise = null

/**
 * Load the version registry from versions/config.json.
 * Memoized: the first call fetches, subsequent calls reuse the same promise so
 * the config is fetched only once per page load.
 * @returns {Promise<{defaultVersion: string, versions: Array}>}
 */
export function loadVersionConfig() {
  if (!configPromise) {
    configPromise = fetch(`${import.meta.env.BASE_URL}versions/config.json`)
      .then(response => response.json())
      .catch(error => {
        console.error('Failed to load version config:', error)
        return { defaultVersion: EMERGENCY_FALLBACK_VERSION, versions: [] }
      })
  }
  return configPromise
}

/**
 * Resolve the default version from a loaded config.
 * Prefers the version flagged `active: true`, then `defaultVersion`, then the
 * emergency fallback literal.
 * @param {{defaultVersion?: string, versions?: Array}} config
 * @returns {string} Version id
 */
export function resolveDefaultVersion(config) {
  const active = config?.versions?.find(v => v.active === true)
  if (active) return active.id
  return config?.defaultVersion || EMERGENCY_FALLBACK_VERSION
}
