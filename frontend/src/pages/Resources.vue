<script setup>
import { ref, onMounted } from 'vue'
import { useVersion } from '../composables/useVersion'

const { loadVersionData } = useVersion()
const sections = ref([])
const error = ref(null)

onMounted(async () => {
  try {
    const data = await loadVersionData('resources.json')
    sections.value = data.sections || []
  } catch (e) {
    console.error('Failed to load resources.json', e)
    error.value = 'Failed to load resources.'
  }
})
</script>

<template>
  <main class="container pb-5">
    <h1 class="h3 my-4">Resources</h1>
    <p class="text-muted">This page contains curated links and references for course materials and tools.</p>
    <div v-if="error" class="alert alert-warning">{{ error }}</div>
    <div v-else>
      <section v-for="section in sections" :key="section.title" class="mb-4">
        <h2 class="h4 mb-2">{{ section.title }}</h2>
        <p class="text-muted small mb-3">{{ section.description }}</p>
        <ul>
          <li v-for="resource in section.resources" :key="resource.href">
            <a :href="resource.href" target="_blank" rel="noopener">{{ resource.title }}</a>
            <span v-if="resource.description" class="text-muted small"> - {{ resource.description }}</span>
          </li>
        </ul>
      </section>
    </div>
  </main>
</template>
