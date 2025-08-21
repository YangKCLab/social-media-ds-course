<script setup>
import { ref, onMounted, computed } from 'vue'

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

const weekGroups = computed(() => {
  const map = new Map()
  for (const row of schedule.value) {
    const key = row.week ?? '—'
    if (!map.has(key)) map.set(key, [])
    map.get(key).push(row)
  }
  return Array.from(map.entries()).map(([week, items]) => ({ week, items }))
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
        <tbody v-for="group in weekGroups" :key="'w'+group.week">
          <tr class="table-secondary week-header">
            <th colspan="5">Week {{ group.week }}</th>
          </tr>
          <tr v-for="row in group.items" :key="row.week + '-' + row.date">
            <td class="text-muted" style="white-space:nowrap">{{ row.week }}</td>
            <td style="white-space:nowrap">{{ row.date }}</td>
            <td>
              <span v-if="/^\s*No class/i.test(row.lectureTopic)" class="badge text-bg-secondary me-2">No class</span>
              {{ row.lectureTopic }}
            </td>
            <td>
              <span v-if="/^no\s*reading$/i.test(row.readingTopic || '')" class="badge text-bg-secondary me-2">No reading</span>
              {{ row.readingTopic }}
            </td>
            <td>
              <template v-if="row.materials && row.materials.length">
                <ul class="mb-0 ps-3">
                  <li v-for="m in row.materials" :key="m.title">
                    <a :href="m.url" target="_blank" rel="noopener">{{ m.title }}</a>
                  </li>
                </ul>
              </template>
              <template v-else>
                <span v-if="/^no\s*reading$/i.test(row.readingTopic || '')" class="badge text-bg-secondary">No reading</span>
                <span v-else class="badge text-bg-warning">TBD</span>
              </template>
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
.week-header th {
  font-weight: 600;
}
</style>
