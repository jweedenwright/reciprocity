<template>
  <MDBContainer>
    <div
      class="d-flex w-100 align-items-center bg-white shadow-lg">
      <!-- Only render the list if we actually have data back from the API -->
      <div class="p-3" v-if="recipe" v-html="recipe.content"></div>
      <h3 v-else-if="isLoading">Loading...</h3>
      <h3 v-else-if="hasError">Error loading recipe</h3>
  </div>
  </MDBContainer>
</template>

<script setup lang="ts">
import { MDBContainer, MDBListGroup, MDBListGroupItem, MDBBadge } from "mdb-vue-ui-kit";
import { ref, onMounted } from 'vue';
import axios from 'axios';
import DOMPurify from 'dompurify'

const isLoading = ref(true);
const hasError = ref(false);
const recipe = ref();

onMounted(async () => {
  try {
    const recipe_path = (window.location.hash).replaceAll('#','')
    const response = await axios.get(`http://localhost:5000/api${recipe_path}`);
    if (response.status !== 200) throw new Error('Network error')
    const rawData = await response.data // Or response.json(), depending on your API structure
    recipe.value = rawData;
  } catch (error) {
    console.error('Failed to fetch HTML:', error)
    hasError.value = true
  } finally {
    isLoading.value = false
  }
});

</script>