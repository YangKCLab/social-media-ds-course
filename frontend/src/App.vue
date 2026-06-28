<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'

const route = useRoute()
const versions = ref([])

// Load available versions from config
onMounted(async () => {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}versions/config.json`)
    const config = await response.json()
    versions.value = config.versions
  } catch (error) {
    console.error('Failed to load version config:', error)
  }
})

const currentVersion = computed(() => route.params.version || 'Fall2026')

// Optional external schedule link (e.g. a Google Sheet). Sourced from the
// version's home.json so the URL lives in one place. When set, the Schedule
// nav item links out; otherwise it falls back to the internal schedule page.
const scheduleUrl = ref(null)
watch(currentVersion, async (version) => {
  scheduleUrl.value = null
  if (!version) return
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}versions/${version}/content/home.json`)
    if (response.ok) {
      scheduleUrl.value = (await response.json()).scheduleUrl || null
    }
  } catch (error) {
    // Ignore and fall back to the internal schedule route.
  }
}, { immediate: true })

// Get current version config
const currentVersionConfig = computed(() => {
  const match = versions.value.find(v => v.id === currentVersion.value)
  if (!match && currentVersion.value) {
    console.warn(`No config found for version: ${currentVersion.value}`)
  }
  return match || {}
})

// Get navigation settings with defaults
const navigation = computed(() => {
  return currentVersionConfig.value.navigation || {
    home: true,
    schedule: true,
    resources: true,
    staff: true
  }
})

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
          <li v-if="navigation.home" class="nav-item"><RouterLink class="nav-link" :to="`/${currentVersion}/`">Home</RouterLink></li>
          <li v-if="navigation.schedule" class="nav-item">
            <a v-if="scheduleUrl" class="nav-link" :href="scheduleUrl" target="_blank" rel="noopener">Schedule</a>
            <RouterLink v-else class="nav-link" :to="`/${currentVersion}/schedule`">Schedule</RouterLink>
          </li>
          <li v-if="navigation.resources" class="nav-item"><RouterLink class="nav-link" :to="`/${currentVersion}/resources`">Resources</RouterLink></li>
          <li v-if="navigation.staff" class="nav-item"><RouterLink class="nav-link" :to="`/${currentVersion}/staff`">Staff</RouterLink></li>
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
.app-shell {
  --bs-link-color: var(--course-accent);
  --bs-link-hover-color: color-mix(in srgb, var(--course-accent) 80%, black);
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
