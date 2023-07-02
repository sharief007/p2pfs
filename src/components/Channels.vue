<template>
  <v-toolbar flat density="compact">
    <v-text-field
      flat
      class="mx-2"
      density="compact"
      variant="solo"
      placeholder="Search..."
      rounded
      hide-details
      prepend-inner-icon="mdi-magnify"
    ></v-text-field>
    <v-btn icon @click="rtcStore.createOffer">
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </v-toolbar>
  <v-container style="height: 100%"> {{ rtcStore.sdp }} </v-container>
</template>

<script setup>
import usertcStore from '../store/webrtc'

const rtcStore = usertcStore()
</script>
