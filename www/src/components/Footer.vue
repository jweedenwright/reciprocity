<template>
    <MDBFooter :text="['center']" bg="white">
        <!-- Grid container -->
        <MDBContainer class="p-2 pb-0">
            <!-- Section: Pages -->
            <section class="mb-2">
            
                <MDBRow class="align-items-end">

                    <MDBCol>
                        <!-- Cookbook -->
                        <RouterLink
                            to="/"
                            class="btn btn-primary m-1 rounded-4"
                            style="background-color: #ff8800">
                                <MDBIcon icon="book" size="2x"/>
                        </RouterLink>
                    </MDBCol>
                    <MDBCol>
                        <!-- Grocery List -->
                        <RouterLink
                            to="/groceries"
                            class="btn btn-primary m-1 rounded-4"
                            style="background-color: #005985">
                                <MDBIcon icon="carrot" size="2x"/>
                        </RouterLink>
                    </MDBCol>
                    <MDBCol>
                        <!-- Substitutions -->
                        <RouterLink
                            to="/substitutions"
                            class="btn btn-primary m-1 rounded-4"
                            style="background-color: #446f2b">
                                <MDBIcon icon="exchange-alt" size="2x"/>
                        </RouterLink>
                    </MDBCol>
                </MDBRow>
            </section>
            <!-- Section: Pages -->
        </MDBContainer>
  </MDBFooter>
</template>

<script setup lang="ts">
  import {
    MDBFooter,
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBBtn,
    MDBIcon
  } from 'mdb-vue-ui-kit';
</script>