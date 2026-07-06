<template>
    <MDBNavbar class="p-0 pb-0 ps-3 pe-3">
        <span class="navbar-text display-6">{{ headerText }}</span>
        <MDBBtnGroup aria-label="Help Buttons">
          <MDBBtn tag="a" size="sm" outline="secondary"> Text Size </MDBBtn>
          <MDBBtn tag="a" size="sm" outline="secondary" color="primary"> Cook Mode </MDBBtn>
        </MDBBtnGroup>
    </MDBNavbar>
</template>

<script setup lang="ts">
  import { MDBNavbar, MDBNavbarNav, MDBIcon, MDBBtn, MDBBtnGroup } from 'mdb-vue-ui-kit';

  defineProps<{
    headerText: string;
  }>();
</script>