<script setup>
import { ref, onMounted, computed } from 'vue'
import { useVersion } from '../composables/useVersion'

const { loadVersionData, currentVersion } = useVersion()
const homeData = ref(null)

// Base URL for assets
const baseUrl = import.meta.env.BASE_URL

// Computed syllabus PDF URL
const syllabusPdfUrl = computed(() => `${baseUrl}versions/${currentVersion.value}/content/syllabus.pdf`)

onMounted(async () => {
  try {
    homeData.value = await loadVersionData('home.json')
  } catch (error) {
    console.error('Failed to load home data:', error)
    // Fallback to defaults
    homeData.value = {
      semester: 'Fall 2025',
      classTime: 'Tuesdays & Thursdays 9:45am-11:15am',
      location: 'Classroom Wing (CW) 110',
      grading: { quizzes: 15, projects: 75, demo: 10 },
      gradingScale: { A: '100–90', B: '89–80', C: '79–70', D: '69–60', F: '59–0' }
    }
  }
})
</script>

<template>
  <main class="container pb-5">
    <section class="mb-4">
      <h1 class="display-6">CS 415/515 Social Media Data Science Pipelines</h1>
      <p class="lead" id="description">
        The focus of this course is on applying data science techniques to large-scale social media.
        Topics include data collection and management, exploratory analysis and measurement techniques,
        data visualization, hypothesis testing and statistical modeling, and real-time analytics. Students
        will build an end-to-end pipeline and use it to answer questions about online events as they occur.
      </p>
    </section>

    <section v-if="homeData" class="row gy-3 mb-5">
      <div class="col-md-12">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title" id="schedule">Time and Place</h5>
            <ul class="mb-0">
              <li>{{ homeData.semester }}</li>
              <li>{{ homeData.classTime }}</li>
              <li>Location: {{ homeData.location }}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section class="mb-5">
      <h3>Course Objectives</h3>
      <p>
        Upon successful completion of this course, you will be able to:
      </p>
      <ul>
        <li>Build a continuous data system for social media.</li>
        <li>Manage collected data.</li>
        <li>Design and execute various measurements on social media.</li>
        <li>Model and analyze online behavior via social media.</li>
        <li>Create visualizations that help understand social media phenomena.</li>
      </ul>
    </section>

    <section class="mb-5">
      <h3 id="syllabus">Syllabus</h3>
      <p>
        Download the most up-to-date syllabus (PDF):
        <a
          class="btn btn-outline-primary btn-sm ms-1"
          :href="syllabusPdfUrl"
          target="_blank"
          rel="noopener"
        >
          View Syllabus
        </a>
      </p>
      <p>
        The syllabus is subject to change, so please check it regularly for updates.
      </p>
    </section>


    <section class="mb-5">
      <h3 id="materials">Course Materials</h3>
      <p>There is no textbook for this course.</p>

      <p>For course materials, please refer to the website: <a href="https://yangkclab.github.io/social-media-analysis/" target="_blank" rel="noopener">https://yangkclab.github.io/social-media-analysis</a>.</p>

      <p>Paper reading assignments will be made available on the <router-link :to="`/${currentVersion}/schedule`">Schedule</router-link> page.</p>

      <p>Slides and other course materials will be made available via Brightspace.</p>
    </section>

    <section class="mb-5">
      <h3>Course Format and Topics</h3>
      <p>
        This class combines lectures with research paper reading and discussions. The lectures cover
        the fundamentals of data science on social media. Reading materials are recent research papers
        aligned with lecture topics.

        Please refer to <router-link :to="`/${currentVersion}/schedule`">Schedule</router-link> for the detailed lecture topics and reading materials.
      </p>
      <div class="row g-3">
        <div class="col-md-6">
          <div class="card h-100">
            <div class="card-body">
              <h6 class="card-title">Lecture Topics</h6>
              <ul class="mb-0">
                <li>What is Data Science and what does social media have to do with it?</li>
                <li>Data collection</li>
                <li>Social media data formats</li>
                <li>Data management with RDBMS/NoSQL</li>
                <li>Probability and statistics; hypothesis testing</li>
                <li>Applications of Machine Learning</li>
                <li>Visualization</li>
              </ul>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="card h-100">
            <div class="card-body">
              <h6 class="card-title">Reading Topics</h6>
              <ul class="mb-0">
                <li>Dataset and data collection</li>
                <li>Algorithmic bias</li>
                <li>Inauthentic behaviors</li>
                <li>Ethics and data access</li>
                <li>Generative AI and social media</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="mb-5">
      <h3>Prerequisites</h3>
      <ul>
        <li>CS 350 Operating Systems</li>
        <li>CS 375 Design & Analysis of Algorithms</li>
        <li>MATH 327 Probability with Statistical Methods or equivalent</li>
        <li>Proficiency in at least one programming language</li>
      </ul>
    </section>

    <section v-if="homeData" class="mb-5">
      <h3 id="grading">Method of Assessment</h3>
      <ul>
        <li>Paper reading quizzes: {{ homeData.grading.quizzes }}%</li>
        <li>Three programming projects: {{ homeData.grading.projects }}% (evenly split)</li>
        <li>Final demonstration: {{ homeData.grading.demo }}%</li>
      </ul>
      <h4 class="mt-3">Grading Scale</h4>
      <ul>
        <li>A: {{ homeData.gradingScale.A }}</li>
        <li>B: {{ homeData.gradingScale.B }}</li>
        <li>C: {{ homeData.gradingScale.C }}</li>
        <li>D: {{ homeData.gradingScale.D }}</li>
        <li>F: {{ homeData.gradingScale.F }}</li>
      </ul>
    </section>

    <footer class="text-center text-muted">
      <hr />
      <div>Last updated {{ new Date().toLocaleDateString() }}.</div>
      <div>
        Source on <a href="https://github.com/YangKCLab/social-media-ds-course" target="_blank" rel="noopener">GitHub</a>.
      </div>
    </footer>
  </main>
</template>

<style scoped>
main {
  max-width: 980px;
}
.card-title {
  margin-bottom: 0.5rem;
}
</style>
