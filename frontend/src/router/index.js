import { createRouter, createWebHistory } from 'vue-router'
import { normalizeVersion } from '../composables/useVersion'
import { loadVersionConfig, resolveDefaultVersion, normalizeNavigation } from '../composables/useConfig'

import HomeWrapper from '../wrappers/HomeWrapper.vue'
import Schedule from '../pages/Schedule.vue'
import Resources from '../pages/Resources.vue'
import Staff from '../pages/Staff.vue'

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
    next(`/${resolveDefaultVersion(config)}/`)
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
      const defaultVersion = resolveDefaultVersion(config)
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

    // Case 3: Disabled or external-only page → redirect to the version home.
    // A non-home target is reachable only when its nav entry is enabled and is
    // not an external link. This keeps disabled pages (whose content JSON may be
    // absent) and externally-routed pages from rendering an in-app load error.
    if (to.name && to.name !== 'home') {
      const entry = config.versions.find(v => v.id === canonicalVersion)
      const nav = normalizeNavigation(entry?.navigation)
      const navItem = nav[to.name]
      const reachable = navItem ? navItem.enabled && !navItem.external : true
      if (!reachable) {
        next(`/${canonicalVersion}/`)
        return
      }
    }
  }

  // Version is already correct and target is reachable → proceed
  next()
})
