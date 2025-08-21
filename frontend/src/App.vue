<script setup>
// Simple, static course page
</script>

<template>
  <header class="navbar navbar-expand-lg navbar-light bg-light border-bottom mb-4">
    <div class="container">
      <a class="navbar-brand fw-semibold" href="#">CS 415/515 — Social Media Data Science</a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <nav id="navbarNav" class="collapse navbar-collapse">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item"><a class="nav-link" href="#description">Description</a></li>
          <li class="nav-item"><a class="nav-link" href="#schedule">Time & Place</a></li>
          <li class="nav-item"><a class="nav-link" href="#materials">Materials</a></li>
          <li class="nav-item"><a class="nav-link" href="#grading">Grading</a></li>
          <li class="nav-item"><a class="nav-link" href="#policies">Policies</a></li>
          <li class="nav-item"><a class="nav-link" href="#staff">Staff</a></li>
        </ul>
      </nav>
    </div>
  </header>

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
      <div class="col-md-6">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title" id="schedule">Time and Place</h5>
            <ul class="mb-0">
              <li>Fall 2025</li>
              <li>Tuesdays & Thursdays 9:45am–11:15am</li>
              <li>Location: Engineering Building (room TBA)</li>
              <li>First day: per university calendar</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title" id="staff">Staff</h5>
            <ul class="mb-0">
              <li>Instructor: <a href="https://www.kaichengyang.me/kaicheng" target="_blank" rel="noopener">Kai-Cheng Yang</a> (<a href="mailto:yangkc@binghamton.edu">yangkc@binghamton.edu</a>)</li>
              <li>Office: G06A, Engineering Building</li>
              <li>Office Hours: Tue 12:30–2:30pm and by appointment</li>
              <li>TA: TBD</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section class="mb-5">
      <h3 id="materials">Course Materials</h3>
      <p>
        There is no textbook. Lectures and selected research papers form the core materials.
        Paper reading assignments will be made available via Brightspace.
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

    <section class="mb-5" id="policies">
      <h3>Policies (Summary)</h3>
      <ul>
        <li>Programming assignments are team projects (2–3 students).</li>
        <li>Generative AI tools are allowed with guidelines; violations count as academic dishonesty.</li>
        <li>Late assignments may be accepted with a typical 5% penalty; see full syllabus for details.</li>
        <li>See Binghamton SoC academic honesty policy and course syllabus for full details.</li>
      </ul>
      <p class="text-muted small">Refer to the LaTeX syllabus in this repository for the authoritative and complete policy text.</p>
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
