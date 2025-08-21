<script setup>
// Home page content extracted from previous App.vue
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

    <section class="row gy-3 mb-5">
      <div class="col-md-12">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title" id="schedule">Time and Place</h5>
            <ul class="mb-0">
              <li>Fall 2025</li>
              <li>Tuesdays & Thursdays 9:45am-11:15am</li>
              <li>Location: Library North (LN) G412</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section class="mb-5">
      <h3 id="materials">Course Materials</h3>
      <p>
        There is no textbook for this course.
        Lectures and selected research papers form the core materials.
        Paper reading assignments and other course materials will be made available via Brightspace.
      </p>
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

    <section class="mb-5">
      <h3 id="grading">Method of Assessment</h3>
      <ul>
        <li>Paper reading quizzes: 15%</li>
        <li>Three programming projects: 85% (evenly split)</li>
      </ul>
      <h4 class="mt-3">Grading Scale</h4>
      <ul>
        <li>A: 100–90</li>
        <li>B: 89–80</li>
        <li>C: 79–70</li>
        <li>D: 69–60</li>
        <li>F: 59–0</li>
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
