<script setup>
// Placeholder schedule page
const sessions = [
  { week: 'Week 1', topics: ['Course overview', 'Intro to social media data'] },
  { week: 'Week 2', topics: ['Data collection', 'APIs and scraping']} ,
  { week: 'Week 3', topics: ['Storage and management', 'ETL pipelines'] },
]
</script>

<template>
  <main class="container pb-5">
    <h1 class="h3 my-4">Schedule</h1>
    <p class="text-muted">Subject to change; see Brightspace for the latest.</p>
    <div class="list-group">
      <div v-for="s in sessions" :key="s.week" class="list-group-item">
        <h6 class="mb-2">{{ s.week }}</h6>
        <ul class="mb-0">
          <li v-for="t in s.topics" :key="t">{{ t }}</li>
        </ul>
      </div>
    </div>
  </main>
  
</template>

