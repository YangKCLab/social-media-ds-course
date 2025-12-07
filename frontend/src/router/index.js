import { createRouter, createWebHistory } from 'vue-router'

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

// Navigation guard to redirect root to active version
router.beforeEach(async (to, _from, next) => {
  if (to.path === '/') {
    const config = await loadVersionConfig()
    // Find the active version, or fall back to defaultVersion
    const active = config.versions.find(v => v.active === true)
    const version = active ? active.id : config.defaultVersion
    next(`/${version}/`)
  } else {
    next()
  }
})
