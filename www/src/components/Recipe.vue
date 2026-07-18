<template>
  <MDBContainer>
    <div
      class="d-flex w-100 align-items-center bg-white shadow-lg"
      style="height: 100vh">
      <!-- Only render the list if we actually have data back from the API -->
      <h3>Boop</h3>
  </div>
  </MDBContainer>
</template>

<script setup lang="ts">
import { MDBContainer, MDBListGroup, MDBListGroupItem, MDBBadge } from "mdb-vue-ui-kit";
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import DOMPurify from 'dompurify'

const isLoading = ref(true);
const hasError = ref(false);
const recipes = ref([]);
const route = useRoute()

onMounted(async () => {
  try {
    const recipe_path = computed(() => route.hash)
    console.log(recipe_path);
    const response = await axios.get(`http://localhost:5000/api/${recipe_path.value}`);
    if (response.status !== 200) throw new Error('Network error')
    console.table(response);
    const rawData = await response.data // Or response.json(), depending on your API structure
    recipes.value = rawData;
  } catch (error) {
    console.error('Failed to fetch HTML:', error)
    hasError.value = true
  } finally {
    isLoading.value = false
  }
});

</script>