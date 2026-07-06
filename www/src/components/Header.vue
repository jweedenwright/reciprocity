<template>
    <MDBNavbar class="justify-content-center p-0 pb-0 ps-3">
        <span class="navbar-text display-6">{{ headerText }}</span>
    </MDBNavbar>
</template>

<script setup lang="ts">
  import { MDBNavbar, MDBNavbarNav } from 'mdb-vue-ui-kit';

  defineProps<{
    headerText: string;
  }>();
</script>