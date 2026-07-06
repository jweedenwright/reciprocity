<template>
  <div id="pwa-container">
    <header class="fixed-top bg-white">
      <Header
        headerText="Reciprocity"
      />
    </header>
    <main class="content">
      <router-view />
    </main>
    <footer class="fixed-bottom sticky bg-white shadow-lg">
      <Footer/>
    </footer>
  </div>
</template>

<style scoped>
#pwa-container {
  font-family: Roboto, Helvetica, Arial, sans-serif;
}
</style>

<script setup lang="ts">
  import Header from "./components/Header.vue";
  import Footer from "./components/Footer.vue";
</script>