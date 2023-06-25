<template>
  <div>
    <v-tabs v-model="tab" v-if="smAndUp && !sm" align-tabs="center" fixed-tabs>
      <v-tab value="progress" prepend-icon="mdi-progress-clock"><strong>Queued</strong></v-tab>
      <v-tab value="completed" prepend-icon="mdi-checkbox-marked-circle-auto-outline"
        ><strong>Finished</strong></v-tab
      >
      <v-tab value="failed" prepend-icon="mdi-close-circle"><strong>Failed</strong></v-tab>
    </v-tabs>
    <v-window v-model="tab" style="height: calc(100vh - 6rem)" class="overflow-y-auto">
      <v-window-item value="progress">
        <v-list density="compact">
          <div v-for="i in taskList" :key="i">
            <TaskBar />
          </div>
        </v-list>
      </v-window-item>
      <v-window-item value="completed"> </v-window-item>
      <v-window-item value="failed"> </v-window-item>
    </v-window>
    <v-bottom-navigation grow mandatory v-if="smAndDown" v-model:model-value="tab">
      <v-btn value="progress">
        <v-icon>mdi-progress-clock</v-icon>
        <span>Queued</span>
      </v-btn>
      <v-btn value="completed">
        <v-icon>mdi-checkbox-marked-circle-auto-outline</v-icon>
        <span>Finished</span>
      </v-btn>
      <v-btn value="failed">
        <v-icon>mdi-close-circle</v-icon>
        <span>Failed</span>
      </v-btn>
    </v-bottom-navigation>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useDisplay } from 'vuetify/lib/framework.mjs'

import TaskBar from './TaskBar.vue'
import { onMounted } from 'vue'

const tab = ref('progress')
const taskList = ref([])
const { sm, smAndUp, smAndDown } = useDisplay()

onMounted(() => {
  for (let i = 0; i < 25; i++) {
    taskList.value.push(i)
  }
})
</script>
