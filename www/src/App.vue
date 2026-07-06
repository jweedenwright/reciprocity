<template>
  <div id="pwa-container">
    <header>
      <Header
        headerText="Reciprocity"
      />
    </header>
    <main class="content">
      <router-view />
    </main>
    <footer class="fixed-bottom">
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