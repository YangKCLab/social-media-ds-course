<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header class="navbar navbar-expand-lg navbar-light bg-light border-bottom mb-4">
    <div class="container">
      <RouterLink class="navbar-brand fw-semibold" to="/">CS 415/515 — Social Media Data Science</RouterLink>
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
          <li class="nav-item"><RouterLink class="nav-link" to="/schedule">Schedule</RouterLink></li>
          <li class="nav-item"><RouterLink class="nav-link" to="/resources">Resources</RouterLink></li>
          <li class="nav-item"><a class="nav-link" href="#grading">Grading</a></li>
          <li class="nav-item"><a class="nav-link" href="#policies">Policies</a></li>
        </ul>
      </nav>
    </div>
  </header>
  <RouterView />
</template>

<style scoped>
/* Navbar spacing and minor tweaks */
</style>
