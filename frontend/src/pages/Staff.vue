<script setup>
import { ref, onMounted } from 'vue'
import { useVersion } from '../composables/useVersion'

const { loadVersionData } = useVersion()
const staffData = ref(null)

onMounted(async () => {
  try {
    staffData.value = await loadVersionData('staff.json')
  } catch (error) {
    console.error('Failed to load staff data:', error)
    // Fallback to defaults
    staffData.value = {
      instructor: {
        name: 'Kai-Cheng Yang',
        website: 'https://www.kaichengyang.me/kaicheng',
        email: 'yangkc@binghamton.edu',
        office: 'G06A, Engineering Building',
        officeHours: 'Tue 12:30–2:30pm and by appointment',
      },
      tas: []
    }
  }
})
</script>

<template>
  <main v-if="staffData" class="container pb-5">
    <h1 class="h3 my-4">Staff</h1>

    <section class="mb-4">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Instructor</h5>
          <ul class="mb-0">
            <li>
              <strong>{{ staffData.instructor.name }}</strong>
              — <a :href="staffData.instructor.website" target="_blank" rel="noopener">website</a>
            </li>
            <li>Email: <a :href="`mailto:${staffData.instructor.email}`">{{ staffData.instructor.email }}</a></li>
            <li>Office: {{ staffData.instructor.office }}</li>
            <li>Office Hours: {{ staffData.instructor.officeHours }}</li>
          </ul>
        </div>
      </div>
    </section>

    <section>
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Teaching Assistants</h5>
          <div v-if="!staffData.tas.length || (staffData.tas.length === 1 && !staffData.tas[0].email)" class="text-muted">TAs will be announced soon.</div>
          <ul v-else class="mb-0">
            <li v-for="ta in staffData.tas" :key="ta.name">
              <strong>{{ ta.name }}</strong>
              <template v-if="ta.email"> — <a :href="`mailto:${ta.email}`">{{ ta.email }}</a></template>
              <template v-if="ta.officeHours"> — Office Hours: {{ ta.officeHours }}</template>
            </li>
          </ul>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
main { max-width: 980px; }
</style>
