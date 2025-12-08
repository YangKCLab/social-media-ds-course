import { createRouter, createWebHistory } from 'vue-router'
import { normalizeVersion } from '../composables/useVersion'

import HomeWrapper from '../wrappers/HomeWrapper.vue'
import Schedule from '../pages/Schedule.vue'
import Resources from '../pages/Resources.vue'
import Staff from '../pages/Staff.vue'

// Load version config to determine active version
let configPromise = null

async function loadVersionConfig() {
  if (!configPromise) {
    configPromise = fetch(`${import.meta.env.BASE_URL}versions/config.json`)
      .then(response => response.json())
      .catch(error => {
        console.error('Failed to load version config:', error)
        return { defaultVersion: 'Fall2025', versions: [] }
      })
  }
  return configPromise
}

export const router = createRouter({
  // Use history mode with Vite base for GH Pages
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Root route - will be redirected by navigation guard
    {
      path: '/',
      name: 'root',
      component: { template: '<div></div>' } // Placeholder component
    },
    // Version-specific routes
    {
      path: '/:version',
      children: [
        { path: '', name: 'home', component: HomeWrapper },
        { path: 'schedule', name: 'schedule', component: Schedule },
        { path: 'resources', name: 'resources', component: Resources },
        { path: 'staff', name: 'staff', component: Staff },
      ],
    },
  ],
  scrollBehavior(_to, _from, saved) {
    if (saved) return saved
    return { top: 0 }
  },
})

// Navigation guard to redirect root and normalize version case
router.beforeEach(async (to, _from, next) => {
  // Handle root path redirect
  if (to.path === '/') {
    const config = await loadVersionConfig()
    const active = config.versions.find(v => v.active === true)
    const version = active ? active.id : config.defaultVersion
    next(`/${version}/`)
    return
  }

  // Handle version normalization
  const versionParam = to.params.version
  if (versionParam) {
    const config = await loadVersionConfig()
    const canonicalVersion = normalizeVersion(versionParam, config.versions)

    // Case 1: Version not found in config → redirect to default version
    if (!canonicalVersion) {
      console.warn(`Unknown version: ${versionParam}, redirecting to default`)
      const active = config.versions.find(v => v.active === true)
      const defaultVersion = active ? active.id : config.defaultVersion
      const targetPath = to.path.replace(`/${versionParam}`, `/${defaultVersion}`)
      next(targetPath)
      return
    }

    // Case 2: Version exists but wrong case → redirect to canonical case
    if (canonicalVersion !== versionParam) {
      console.log(`Normalizing version: ${versionParam} → ${canonicalVersion}`)
      const targetPath = to.path.replace(`/${versionParam}`, `/${canonicalVersion}`)
      next(targetPath)
      return
    }
  }

  // Case 3: Version is already correct or no version param → proceed
  next()
})
