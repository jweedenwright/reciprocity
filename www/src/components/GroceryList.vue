<template>
  <MDBContainer>
    <div
      class="d-flex justify-content-center align-items-center bg-white shadow-lg"
      style="height: 100vh"
    >
      <MDBRow tag="form" class="p-4">
        <MDBCheckbox label="Onions" v-model="checkbox1" />
        <MDBCheckbox label="Tomatoes" v-model="checkbox2" />
        <MDBCheckbox label="Carrots" v-model="checkbox3" />
        <MDBCheckbox label="Potatoes" v-model="checkbox4" />
      </MDBRow>
    </div>
  </MDBContainer>
</template>

<script setup lang="ts">
import { MDBContainer, MDBRow, MDBCol, MDBCheckbox } from "mdb-vue-ui-kit";
import { ref } from "vue";

const checkbox1 = ref(false);
const checkbox2 = ref(false);
const checkbox3 = ref(false);
const checkbox4 = ref(false);
</script>
