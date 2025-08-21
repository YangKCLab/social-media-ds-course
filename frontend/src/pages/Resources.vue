<script setup>
// Placeholder resources page
const resources = [
  { title: 'Syllabus (PDF)', href: 'https://github.com/YangKCLab/social-media-ds-course/tree/main/syllabus' },
  { title: 'University Brightspace', href: '#' },
  { title: 'Python', href: 'https://www.python.org/' },
  { title: 'Pandas', href: 'https://pandas.pydata.org/' },
  { title: 'Matplotlib', href: 'https://matplotlib.org/' },
]
</script>

<template>
  <main class="container pb-5">
    <h1 class="h3 my-4">Resources</h1>
    <p class="text-muted">Curated links and references for course materials and tools.</p>
    <ul>
      <li v-for="r in resources" :key="r.href">
        <a :href="r.href" target="_blank" rel="noopener">{{ r.title }}</a>
      </li>
    </ul>
  </main>
</template>

