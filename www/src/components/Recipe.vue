<template>
  <MDBContainer>
    <div
      class="d-flex justify-content-center align-items-center bg-white shadow-lg"
      style="height: 100vh"
    >
      <div v-if="isLoading">Loading...</div>
      <div v-else-if="hasError">Error loading content</div>
      <div v-else v-html="apiHtmlContent"></div>
    </div>
  </MDBContainer>
</template>

<script setup lang="ts">
import { MDBContainer } from "mdb-vue-ui-kit";
import { ref, onMounted } from 'vue';
import axios from 'axios';
import DOMPurify from 'dompurify'

defineProps<{ msg: string }>();
const apiHtmlContent = ref('');
const isLoading = ref(true)
const hasError = ref(false)

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/data');
    console.log(response)
    if (response.status !== 200) throw new Error('Network error')
    const rawData = await response.data.message // Or response.json(), depending on your API structure
    // Clean the HTML string to remove malicious scripts
    apiHtmlContent.value = DOMPurify.sanitize(rawData) 
  } catch (error) {
    console.error('Failed to fetch HTML:', error)
    hasError.value = true
  } finally {
    isLoading.value = false
  }
});
</script>
