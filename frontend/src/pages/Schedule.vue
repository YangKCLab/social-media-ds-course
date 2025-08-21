<script setup>
// Hard-coded schedule extracted from CSV (Week, Date, Lecture, Reading theme)
// Update here when the CSV changes.
const schedule = [
  { week: 1, date: "8/19/2025", lectureTopic: "Introduction", readingTopic: "no reading", materials: [] },
  { week: 1, date: "8/21/2025", lectureTopic: "My research / how to read papers", readingTopic: "no reading", materials: [] },
  { week: 2, date: "8/26/2025", lectureTopic: "Intro to social media", readingTopic: "dataset & data collection", materials: [] },
  { week: 2, date: "8/28/2025", lectureTopic: "Intro to social media", readingTopic: "dataset & data collection", materials: [] },
  { week: 3, date: "9/2/2025", lectureTopic: "Data collection", readingTopic: "dataset & data collection", materials: [] },
  { week: 3, date: "9/4/2025", lectureTopic: "Data collection", readingTopic: "dataset & data collection", materials: [] },
  { week: 4, date: "9/9/2025", lectureTopic: "Data collection", readingTopic: "dataset & data collection", materials: [] },
  { week: 4, date: "9/11/2025", lectureTopic: "Git and CLI crash course", readingTopic: "algorithmic bias", materials: [] },
  { week: 5, date: "9/16/2025", lectureTopic: "Discussing the proposal", readingTopic: "algorithmic bias", materials: [] },
  { week: 5, date: "9/18/2025", lectureTopic: "Data format JSON & CSV", readingTopic: "algorithmic bias", materials: [] },
  { week: 6, date: "9/23/2025", lectureTopic: "No class (Rosh Hashanah)", readingTopic: "no reading", materials: [] },
  { week: 6, date: "9/25/2025", lectureTopic: "Data format JSON & CSV", readingTopic: "algorithmic bias", materials: [] },
  { week: 7, date: "9/30/2025", lectureTopic: "Data format JSON & CSV", readingTopic: "algorithmic bias", materials: [] },
  { week: 7, date: "10/2/2025", lectureTopic: "No class (Yom Kippur)", readingTopic: "no reading", materials: [] },
  { week: 8, date: "10/7/2025", lectureTopic: "Database SQL & NoSQL", readingTopic: "algorithmic bias", materials: [] },
  { week: 8, date: "10/9/2025", lectureTopic: "Discussing the P1 imp & report", readingTopic: "inauthentic behaviors", materials: [] },
  { week: 9, date: "10/14/2025", lectureTopic: "Database SQL & NoSQL", readingTopic: "inauthentic behaviors", materials: [] },
  { week: 9, date: "10/16/2025", lectureTopic: "Database SQL & NoSQL", readingTopic: "inauthentic behaviors", materials: [] },
  { week: 10, date: "10/21/2025", lectureTopic: "Discussing the P2 proposal", readingTopic: "inauthentic behaviors", materials: [] },
  { week: 10, date: "10/23/2025", lectureTopic: "Stats basics", readingTopic: "inauthentic behaviors", materials: [] },
  { week: 11, date: "10/28/2025", lectureTopic: "Stats basics", readingTopic: "ethics and data access", materials: [] },
  { week: 11, date: "10/30/2025", lectureTopic: "Stats basics", readingTopic: "ethics and data access", materials: [] },
  { week: 12, date: "11/4/2025", lectureTopic: "Data wrangling & vis", readingTopic: "ethics and data access", materials: [] },
  { week: 12, date: "11/6/2025", lectureTopic: "Data wrangling & vis", readingTopic: "ethics and data access", materials: [] },
  { week: 13, date: "11/11/2025", lectureTopic: "Data wrangling & vis", readingTopic: "ethics and data access", materials: [] },
  { week: 13, date: "11/13/2025", lectureTopic: "Discussing the P2 imp & report", readingTopic: "generative AI and social media", materials: [] },
  { week: 14, date: "11/18/2025", lectureTopic: "Data wrangling & vis", readingTopic: "generative AI and social media", materials: [] },
  { week: 14, date: "11/20/2025", lectureTopic: "Left for flexibility", readingTopic: "generative AI and social media", materials: [] },
  { week: 15, date: "11/25/2025", lectureTopic: "Discussing the P3 proposal", readingTopic: "generative AI and social media", materials: [] },
  { week: 15, date: "11/27/2025", lectureTopic: "No class (Thanks giving break)", readingTopic: "no reading", materials: [] },
  { week: 16, date: "12/2/2025", lectureTopic: "Left for flexibility", readingTopic: "generative AI and social media", materials: [] },
  { week: 16, date: "12/4/2025", lectureTopic: "Left for flexibility", readingTopic: "generative AI and social media", materials: [] },
  { week: 17, date: "12/12/2025", lectureTopic: "Fianl examination week", readingTopic: "", materials: [] },
]
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
