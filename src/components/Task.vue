<template>
  <v-card :loading="isActive">
      <v-card-item>
        <v-card-title>Cafe Badilico</v-card-title>
        <v-card-subtitle class="d-flex flex-no-wrap justify-space-between">
          <span>Local Favorite</span>
          <span>12.3 MB</span>
        </v-card-subtitle>
      </v-card-item>
      <v-divider></v-divider>
      <v-card-action>
        <v-list-item density="comfortable">
          <template v-slot:prepend>
            <strong>{{ progressCompleted }}</strong>
          </template>
        </v-list-item>
      </v-card-action>
    </v-card>
</template>

<script setup>
import { ref, computed } from 'vue'
const progress = ref(Math.random() * 100)
const isActive = ref(true)

const progressCompleted = computed(() => {
  return `${Math.round(progress.value)}% completed`
})
/*const filename = ref('index.jsp ' + new Date().toString())
const filesize = ref(Math.random() * 10 + 'MB')
*/
</script>
