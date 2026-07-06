<template>
    <MDBFooter :text="['center']" bg="white">
        <!-- Grid container -->
        <MDBContainer class="p-2 pb-0">
            <!-- Section: Pages -->
            <section class="mb-2">
            
                <MDBRow class="align-items-end">

                    <MDBCol>
                        <!-- Cookbook -->
                        <MDBBtn
                            tag="a"
                            color="primary"
                            href="/"
                            floating
                            style="background-color: #ff8800"
                            class="m-1 rounded-4">
                                <MDBIcon icon="book" size="2x"/>
                        </MDBBtn>
                    </MDBCol>
                    <MDBCol>
                        <!-- Grocery List -->
                        <MDBBtn
                            tag="a"
                            color="primary"
                            href="/groceries"
                            floating
                            style="background-color: #005985"
                            class="m-1 rounded-4">
                                <MDBIcon icon="carrot" size="2x"/>
                        </MDBBtn>
                    </MDBCol>
                    <MDBCol>
                        <!-- Substitutions -->
                        <MDBBtn
                            tag="a"
                            color="primary"
                            href="/substitutions"
                            floating
                            style="background-color: #446f2b"
                            class="m-1 rounded-4">
                                <MDBIcon icon="exchange-alt" size="2x"/>
                        </MDBBtn>
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