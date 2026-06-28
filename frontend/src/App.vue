<script setup>
import { ref, onMounted, computed } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { EMERGENCY_FALLBACK_VERSION, loadVersionConfig, normalizeNavigation } from './composables/useConfig'

const route = useRoute()
const versions = ref([])

// Load available versions from the shared (memoized) config loader.
onMounted(async () => {
  const config = await loadVersionConfig()
  versions.value = config.versions
})

const currentVersion = computed(() => route.params.version || EMERGENCY_FALLBACK_VERSION)

// Get current version config
const currentVersionConfig = computed(() => {
  const match = versions.value.find(v => v.id === currentVersion.value)
  if (!match && currentVersion.value) {
    console.warn(`No config found for version: ${currentVersion.value}`)
  }
  return match || {}
})

// Get navigation settings, normalized so partial configs get per-tab defaults
// (and so the navbar and router guard agree on what each entry means).
const navigation = computed(() => normalizeNavigation(currentVersionConfig.value.navigation))

// Optional external schedule link (e.g. a Google Sheet). Sourced from
// config.json's navigation.schedule.external so the URL lives in one place.
// When set, the Schedule nav item links out; otherwise it falls back to the
// internal schedule page.
const scheduleUrl = computed(() => navigation.value.schedule?.external || null)

// Per-iteration accent color cue. Each version may set an `accent` hex in
// config.json; it tints the navbar strip, brand, active link, and outline
// buttons so the current semester is identifiable at a glance. Teal is the
// neutral fallback if a version omits it.
const accentColor = computed(() => currentVersionConfig.value.accent || '#0d9488')
</script>

<template>
  <div class="app-shell" :style="{ '--course-accent': accentColor }">
  <header class="navbar navbar-expand-lg navbar-light bg-light border-bottom mb-4">
    <div class="container">
      <RouterLink class="navbar-brand fw-semibold" :to="`/${currentVersion}/`">CS 415/515 — Social Media Data Science</RouterLink>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <nav id="navbarNav" class="collapse navbar-collapse">
        <ul class="navbar-nav ms-auto">
          <li v-if="navigation.home?.enabled" class="nav-item"><RouterLink class="nav-link" :to="`/${currentVersion}/`">Home</RouterLink></li>
          <li v-if="navigation.schedule?.enabled" class="nav-item">
            <a v-if="scheduleUrl" class="nav-link" :href="scheduleUrl" target="_blank" rel="noopener">Schedule</a>
            <RouterLink v-else class="nav-link" :to="`/${currentVersion}/schedule`">Schedule</RouterLink>
          </li>
          <li v-if="navigation.resources?.enabled" class="nav-item"><RouterLink class="nav-link" :to="`/${currentVersion}/resources`">Resources</RouterLink></li>
          <li v-if="navigation.staff?.enabled" class="nav-item"><RouterLink class="nav-link" :to="`/${currentVersion}/staff`">Staff</RouterLink></li>
          <li v-if="versions.length > 1" class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {{ versions.find(v => v.id === currentVersion)?.displayName || currentVersion }}
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
              <li v-for="version in versions" :key="version.id">
                <RouterLink
                  class="dropdown-item"
                  :class="{ active: version.id === currentVersion }"
                  :to="`/${version.path}/`"
                >
                  {{ version.displayName }}
                </RouterLink>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  </header>
  <RouterView />
  </div>
</template>

<!-- Not scoped: the accent must reach outline buttons rendered inside
     RouterView child components (e.g. the version-specific Home page). The
     --course-accent custom property is set on .app-shell and cascades to all
     descendants, so these rules pick up the active iteration's color. -->
<style>
/* Bootstrap 5.3 colors anchors via --bs-link-color-rgb inside rgba(), so a hex
   override there is ignored. Set the color directly on body links, excluding
   anchors that already have their own treatment (nav, brand, buttons). */
.app-shell a:not(.btn):not(.nav-link):not(.navbar-brand):not(.dropdown-toggle):not(.dropdown-item) {
  color: var(--course-accent);
}
.app-shell a:not(.btn):not(.nav-link):not(.navbar-brand):not(.dropdown-toggle):not(.dropdown-item):hover {
  color: color-mix(in srgb, var(--course-accent) 80%, black);
}
.app-shell .navbar {
  border-top: 3px solid var(--course-accent);
}
.app-shell .navbar-brand {
  color: var(--course-accent);
}
.app-shell .nav-link.router-link-exact-active {
  color: var(--course-accent);
}
.app-shell .btn-outline-primary {
  --bs-btn-color: var(--course-accent);
  --bs-btn-border-color: var(--course-accent);
  --bs-btn-hover-bg: var(--course-accent);
  --bs-btn-hover-border-color: var(--course-accent);
  --bs-btn-active-bg: var(--course-accent);
  --bs-btn-active-border-color: var(--course-accent);
}
</style>
