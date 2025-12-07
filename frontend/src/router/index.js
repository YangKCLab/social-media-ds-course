import { createRouter, createWebHistory } from 'vue-router'

import HomeWrapper from '../wrappers/HomeWrapper.vue'
import Schedule from '../pages/Schedule.vue'
import Resources from '../pages/Resources.vue'
import Staff from '../pages/Staff.vue'

// Default version - will be used for root redirect
const DEFAULT_VERSION = 'Fall2025'

export const router = createRouter({
  // Use history mode with Vite base for GH Pages
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Redirect root to default version
    {
      path: '/',
      redirect: `/${DEFAULT_VERSION}/`
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
  scrollBehavior(to, from, saved) {
    if (saved) return saved
    return { top: 0 }
  },
})
