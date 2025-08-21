<script setup>
// Schedule table data
// Add/modify rows as the semester progresses
const schedule = [
  {
    week: 1,
    date: 'Tue 09/02',
    lectureTopic: 'Course overview; Intro to social media data',
    readingTopic: 'Dataset and data collection',
    materials: [
      { title: 'TBD — Paper 1', url: '#' },
      { title: 'TBD — Paper 2', url: '#' },
    ],
  },
  {
    week: 2,
    date: 'Tue 09/09',
    lectureTopic: 'Data collection: APIs and scraping best practices',
    readingTopic: 'Ethics and data access',
    materials: [
      { title: 'TBD — Ethics reading', url: '#' },
    ],
  },
  {
    week: 3,
    date: 'Tue 09/16',
    lectureTopic: 'Storage and management; ETL pipelines',
    readingTopic: 'Inauthentic behaviors',
    materials: [
      { title: 'TBD — Inauthentic behavior reading', url: '#' },
    ],
  },
]
</script>

<template>
  <main class="container pb-5">
    <h1 class="h3 my-4">Schedule</h1>
    <p class="text-muted">Subject to change; see Brightspace for the latest details.</p>

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
          <tr v-for="row in schedule" :key="row.week">
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
              <span v-else class="text-muted">TBD</span>
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
