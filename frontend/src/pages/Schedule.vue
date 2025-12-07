<script setup>
import { ref, onMounted, computed } from 'vue'
import { useVersion } from '../composables/useVersion'

const { loadVersionData } = useVersion()
const schedule = ref([])

onMounted(async () => {
  try {
    const data = await loadVersionData('schedule.json')
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

const isNoClass = (topic) => /^\s*No class/i.test(topic || '')
const lectureRemainder = (topic) => (topic || '').replace(/^\s*No class\s*/i, '').trim()
const isNoReading = (topic) => /^no\s*reading$/i.test((topic || '').trim())
const isEmpty = (s) => !(s && String(s).trim())
// Compose a project badge label from schedule.json fields (robust to key names)
const projectLabel = (row) => {
  if (!row || typeof row !== 'object') return ''
  const entries = Object.entries(row)
  if (row.project && typeof row.project === 'object') {
    entries.push(...Object.entries(row.project))
  }
  const norm = (k) => String(k).toLowerCase().replace(/[\s_-]+/g, '')
  const map = new Map(entries.map(([k, v]) => [norm(k), v]))

  const num = map.get('projectnumber') ?? map.get('projectno') ?? map.get('p') ?? map.get('pnum')
  const ev = map.get('event') ?? map.get('projectevent') ?? map.get('milestone') ?? ''
  const n = (num !== undefined && num !== null && String(num).trim() !== '') ? String(num).trim() : ''
  const e = String(ev || '').trim()
  if (!n && !e) return ''
  if (n && e) return `P${n}: ${e}`
  return n ? `P${n}` : e
}

// Determine badge color based on project number
const projectBadgeClass = (row) => {
  if (!row || typeof row !== 'object') return 'text-bg-info'
  const entries = Object.entries(row)
  if (row.project && typeof row.project === 'object') {
    entries.push(...Object.entries(row.project))
  }
  const norm = (k) => String(k).toLowerCase().replace(/[\s_-]+/g, '')
  const map = new Map(entries.map(([k, v]) => [norm(k), v]))
  const numRaw = map.get('projectnumber') ?? map.get('projectno') ?? map.get('p') ?? map.get('pnum')
  const n = String(numRaw ?? '').trim()
  switch (n) {
    case '1': return 'text-bg-primary'
    case '2': return 'text-bg-success'
    case '3': return 'text-bg-warning'
    case '4': return 'text-bg-danger'
    default: return 'text-bg-info'
  }
}

// Utilities to detect past dates (relative to local today)
const parseMDY = (mdy) => {
  if (!mdy) return null
  const parts = String(mdy).split('/')
  if (parts.length !== 3) return null
  const [m, d, y] = parts.map((p) => Number(p))
  if (!m || !d || !y) return null
  return new Date(y, m - 1, d)
}
const startOfToday = () => {
  const t = new Date()
  return new Date(t.getFullYear(), t.getMonth(), t.getDate())
}
const isPast = (row) => {
  const dt = parseMDY(row?.date)
  if (!dt) return false
  return dt < startOfToday()
}
</script>

<template>
  <main class="container pb-5">
    <h1 class="h3 my-4">Schedule</h1>
    <p>The schedule will be adjusted as we go, so please check it regularly for updates.</p>
    <p>Note: Reading assignments should be completed before class. There may be a quiz on the reading material, and students are expected to participate in class discussions about the papers.</p>

    <div class="table-responsive">
      <table class="table table-striped table-hover align-middle">
        <thead class="table-light">
          <tr>
            <th scope="col" style="white-space:nowrap">Date</th>
            <th scope="col">Lecture Topic</th>
            <th scope="col">Reading Topic</th>
            <th scope="col" style="min-width:220px">Reading Materials</th>
            <th scope="col" style="white-space:nowrap">Projects</th>
          </tr>
        </thead>
        <tbody v-for="group in weekGroups" :key="'w'+group.week">
          <tr class="table-secondary week-header">
            <th colspan="5">Week {{ group.week }}</th>
          </tr>
          <tr
            v-for="row in group.items"
            :key="row.week + '-' + row.date"
            :class="{ 'past-row': isPast(row) || isNoClass(row.lectureTopic) }"
          >
            <td style="white-space:nowrap">{{ row.date }}</td>
            <td>
              <template v-if="isNoClass(row.lectureTopic)">
                <span class="badge text-bg-secondary me-2">No class</span>
                <span v-if="lectureRemainder(row.lectureTopic)">{{ lectureRemainder(row.lectureTopic) }}</span>
              </template>
              <template v-else-if="isEmpty(row.lectureTopic)">
                <span class="badge text-bg-warning">TBD</span>
              </template>
              <template v-else>
                {{ row.lectureTopic }}
              </template>
            </td>
            <td>
              <template v-if="isNoReading(row.readingTopic)">
                <span class="badge text-bg-secondary">No reading</span>
              </template>
              <template v-else>
                {{ row.readingTopic }}
              </template>
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
                <!-- Leave empty when there is no reading that day; otherwise show TBD -->
                <span v-if="!isNoReading(row.readingTopic)" class="badge text-bg-warning">TBD</span>
              </template>
            </td>
            <td>
              <template v-if="projectLabel(row)">
                <span class="badge" :class="projectBadgeClass(row)">{{ projectLabel(row) }}</span>
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
.past-row {
  opacity: 0.7;
}
.past-row td,
.past-row th {
  color: #6c757d; /* Bootstrap gray-600 */
}
</style>
