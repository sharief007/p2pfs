<template>
  <v-list-item density="compact">
    <template v-slot:prepend>
      <v-list-item-action start>
        <!-- <v-checkbox-btn :model-value="isActive"></v-checkbox-btn> -->
        <v-icon size="x-large">mdi-progress-download</v-icon>
      </v-list-item-action>
    </template>
    <template v-slot:append>
      <v-btn icon="mdi-information" variant="text"></v-btn>
      <v-btn icon="mdi-play" variant="text"></v-btn>
      <v-btn icon="mdi-trash-can" variant="text"></v-btn>
    </template>
    <v-list-item-content>
      <v-progress-linear height="25" color="blue" v-model="progress" buffer-value="15" rounded>
        <template v-slot:default="{ value }">
          <strong class="text-truncate mx-4">{{ filename }}</strong>
        </template>
      </v-progress-linear>
    </v-list-item-content>
  </v-list-item>
</template>

<script setup>
import { ref } from 'vue'
const progress = ref(Math.random() * 100)
const filename =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
</script>
