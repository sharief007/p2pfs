<template>
  <div>
    <v-toolbar :flat="true" density="compact">
      <v-text-field
        :flat="true"
        class="mx-2"
        density="compact"
        variant="solo"
        placeholder="Search..."
        rounded
        hide-details
        prepend-inner-icon="mdi-magnify"
      ></v-text-field>
      <v-btn icon>
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-toolbar>
    <v-container style="height: 100%"> {{ rtcStore.sdp }} </v-container>
  </div>
</template>

<script setup>
import UseWebRTCStore from '../store/webrtcStore'
const rtcStore = UseWebRTCStore()
</script>
