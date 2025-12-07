<script setup>
import { computed, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import DefaultHome from '../pages/Home.vue'

const route = useRoute()
const DEFAULT_VERSION = 'Fall2025'

// Compute current version from route
const version = computed(() => route.params.version || DEFAULT_VERSION)

// Import all version-specific Home components at build time using glob
// This must use a static pattern - Vite analyzes this at build time
const versionComponents = import.meta.glob('../../../versions/*/components/Home.vue')

// Dynamically select the appropriate component based on current version
const HomeComponent = computed(() => {
  const componentPath = `../../../versions/${version.value}/components/Home.vue`

  // If a version-specific component exists, load it asynchronously
  if (versionComponents[componentPath]) {
    return defineAsyncComponent(versionComponents[componentPath])
  }

  // Otherwise, use the default shared Home component
  return DefaultHome
})
</script>

<template>
  <Suspense>
    <!-- Render the dynamically selected Home component -->
    <component :is="HomeComponent" />

    <!-- Fallback shown while async component is loading -->
    <template #fallback>
      <div class="container">
        <div class="text-center my-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    </template>
  </Suspense>
</template>
