<template>
  <v-card>
    <v-progress-linear
      height="65"
      color="grey-lighten-3"
      :model-value="progress"
      striped
      buffer-value="10"
    >
      <v-card-item style="width: 100%">
        <v-card-title>Cafe Badilico</v-card-title>
        <v-card-subtitle class="d-flex flex-no-wrap justify-space-between">
          <span>Local Favorite</span>
          <span>12.3 MB</span>
        </v-card-subtitle>
      </v-card-item>
    </v-progress-linear>
    <v-divider></v-divider>
    <v-list-item density="compact" width="100%">
      <template v-slot:prepend>
        <span>
          {{ `${progress}% completed` }}
        </span>
      </template>
      <template v-slot:append>
        <v-btn
          variant="text"
          flat
          size="small"
          @click="console.log('I am here, MF!')"
          prepend-icon="mdi-play"
          >play</v-btn
        >
        <v-btn variant="text" flat size="small" prepend-icon="mdi-trash-can">delete</v-btn>
      </template>
    </v-list-item>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'
const progress = ref(Math.round(Math.random() * 100))
</script>
