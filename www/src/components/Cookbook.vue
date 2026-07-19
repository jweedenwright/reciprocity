<template>
  <MDBContainer class="p-4 w-100 align-items-center bg-white shadow-lg"
        style="height: 100vh">
      <!-- Input to filter recipes -->    
      <div class="form" data-mdb-input-init>
        <input area-label="Filter recipes" class="form-control" type="text" id="recipeSearch" v-model="searchRecipes" placeholder="Filter recipes here..." />
      </div>

      <div v-if="recipes.length > 0">
      
        <!-- Only render the list if we actually have data back from the API -->
        <MDBListGroup light class="mx-3">
          <!-- 1. Use v-for to loop through your API array -->
          <!-- 2. Use v-bind (or the ':' shorthand) to dynamically pass the data properties -->
          <MDBListGroupItem 
            v-for="recipe in filteredRecipes" 
            :key="recipe.id" 
            tag="a" 
            :href="`#/recipe/${recipe.id}`"
            :data-id="recipe.id"
            action
          >
            <h3 class="fw-bold">{{ DOMPurify.sanitize(recipe.name) }}</h3>
            <MDBBadge v-for="tag in recipe.description.split('|')"
              class="badge-warning rounded-pill">{{ DOMPurify.sanitize(tag) }}
            </MDBBadge>
          </MDBListGroupItem>

      </MDBListGroup>
    </div>
    <div v-else>Loading recipes...</div>
  </MDBContainer>
</template>

<script setup lang="ts">
import { MDBContainer, MDBListGroup, MDBListGroupItem, MDBBadge } from "mdb-vue-ui-kit";
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import DOMPurify from 'dompurify'

const isLoading = ref(true);
const hasError = ref(false);
const recipes = ref([]);
const searchRecipes = ref('');

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/cookbook');
    if (response.status !== 200) throw new Error('Network error')
    const rawData = await response.data // Or response.json(), depending on your API structure
    recipes.value = rawData;
  } catch (error) {
    console.error('Failed to fetch HTML:', error)
    hasError.value = true
  } finally {
    isLoading.value = false
  }
});

const filteredRecipes = computed(() => {
  const query = searchRecipes.value.toLowerCase();
  if (!query) return recipes.value; // Return all with no query
  return recipes.value.filter(recipe =>
    recipe.description.toLowerCase().includes(query)
    || recipe.name.toLowerCase().includes(query)
  );
});

</script>