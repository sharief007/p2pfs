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
        <v-container>
          <v-row v-for="i in rowCount" :key="i">
            <v-col v-for="j in colCount" :key="j" :col="12 / colCount">
              <Task />
            </v-col>
          </v-row>
        </v-container>
      </v-window-item>
      <v-window-item value="completed"> </v-window-item>
      <v-window-item value="failed"> </v-window-item>
    </v-window>
    <v-bottom-navigation :grow="true" mandatory v-if="smAndDown" v-model:model-value="tab">
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
import { ref, computed } from 'vue'
import { useDisplay } from 'vuetify'

import Task from './ActiveTask.vue'
import { onMounted } from 'vue'
import UseControlsStore from '../store/controlsStore'

const tab = ref('progress')
const taskList = ref([])
const { smAndDown, sm, smAndUp, name } = useDisplay()
const controlsStore = UseControlsStore()

const colCount = computed(() => {
  switch (name.value) {
    case 'xs':
      return 1
    case 'sm':
      return 2
    case 'md':
      return 2
    case 'lg': {
      return controlsStore.rightDrawer || controlsStore.rightDrawer ? 2 : 3
    }
    case 'xl':
      return 3
    case 'xxl':
      return 4
    default:
      return 6
  }
})

const rowCount = computed(() => {
  return Math.round(taskList.value.length / colCount.value)
})

onMounted(() => {
  for (let i = 0; i < 10; i++) {
    taskList.value.push(i)
  }
})
</script>
