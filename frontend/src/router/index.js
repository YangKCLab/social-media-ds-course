import { createRouter, createWebHistory } from 'vue-router'

import Home from '../pages/Home.vue'
import Schedule from '../pages/Schedule.vue'
import Resources from '../pages/Resources.vue'

export const router = createRouter({
  // Use history mode with Vite base for GH Pages
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/schedule', name: 'schedule', component: Schedule },
    { path: '/resources', name: 'resources', component: Resources },
  ],
  scrollBehavior(to, from, saved) {
    if (saved) return saved
    return { top: 0 }
  },
})
