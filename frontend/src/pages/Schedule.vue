<script setup>
import { ref, onMounted } from 'vue'

const schedule = ref([])

onMounted(async () => {
  try {
    const res = await fetch(import.meta.env.BASE_URL + 'schedule.json')
    const data = await res.json()
    schedule.value = Array.isArray(data) ? data : []
  } catch (e) {
    console.error('Failed to load schedule.json', e)
    schedule.value = []
  }
})
</script>

<template>
  <main class="container pb-5">
    <h1 class="h3 my-4">Schedule</h1>
    <p class="text-muted">The schedule is subject to change, so please check it regularly for updates.</p>

    <div class="table-responsive">
      <table class="table table-striped table-hover align-middle">
        <thead class="table-light">
          <tr>
            <th scope="col" style="white-space:nowrap">Week</th>
            <th scope="col" style="white-space:nowrap">Date</th>
            <th scope="col">Lecture Topic</th>
            <th scope="col">Reading Topic</th>
            <th scope="col" style="min-width:220px">Reading Materials</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in schedule" :key="row.week + '-' + row.date">
            <th scope="row">{{ row.week }}</th>
            <td>{{ row.date }}</td>
            <td>{{ row.lectureTopic }}</td>
            <td>{{ row.readingTopic }}</td>
            <td>
              <template v-if="row.materials && row.materials.length">
                <ul class="mb-0 ps-3">
                  <li v-for="m in row.materials" :key="m.title">
                    <a :href="m.url" target="_blank" rel="noopener">{{ m.title }}</a>
                  </li>
                </ul>
              </template>
              <span v-else class="text-muted">{{ /^no\s*reading$/i.test(row.readingTopic || '') ? 'No reading' : 'TBD' }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>

<style scoped>
td, th {
  vertical-align: top;
}
</style>
