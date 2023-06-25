<template>
  <v-list-item density="compact">
    <template v-slot:prepend>
      <v-list-item-action start>
        <v-icon size="x-large">{{
          `mdi-progress-${Math.round(progress) % 2 == 0 ? 'download' : 'upload'}`
        }}</v-icon>
      </v-list-item-action>
    </template>
    <template v-slot:append>
      <v-btn icon="mdi-information" variant="text"></v-btn>
      <v-btn icon="mdi-play" variant="text"></v-btn>
      <v-btn icon="mdi-trash-can" variant="text"></v-btn>
    </template>
    <v-progress-linear height="25" color="blue" v-model="progress" buffer-value="15" rounded stream>
      <template v-slot:default="{ value }">
        <strong class="text-truncate mx-4">{{ filename }}</strong>
      </template>
    </v-progress-linear>
  </v-list-item>
</template>

<script setup>
import { ref } from 'vue'
const progress = ref(Math.random() * 100)
const filename = 'index.jsp'
</script>
