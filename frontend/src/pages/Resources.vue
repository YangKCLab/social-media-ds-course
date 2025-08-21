<script setup>
import { ref, onMounted } from 'vue'

const resources = ref([])
const error = ref(null)

onMounted(async () => {
  try {
    const res = await fetch(import.meta.env.BASE_URL + 'resources.json')
    const data = await res.json()
    resources.value = Array.isArray(data) ? data : []
  } catch (e) {
    console.error('Failed to load resources.json', e)
    error.value = 'Failed to load resources.'
  }
})
</script>

<template>
  <main class="container pb-5">
    <h1 class="h3 my-4">Resources</h1>
    <p class="text-muted">Curated links and references for course materials and tools.</p>
    <div v-if="error" class="alert alert-warning">{{ error }}</div>
    <ul v-else>
      <li v-for="r in resources" :key="r.href">
        <a :href="r.href" target="_blank" rel="noopener">{{ r.title }}</a>
      </li>
    </ul>
  </main>
</template>
