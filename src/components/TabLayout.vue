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
              <Task
                v-if="getIndex(i, j, colCount) < activeTaskList.length"
                :value="activeTaskList[getIndex(i, j, colCount)]"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-window-item>
      <v-window-item value="completed">
        <v-container>
          <v-row v-for="i in rowCount" :key="i">
            <v-col v-for="j in colCount" :key="j" :col="12 / colCount">
              <Task
                v-if="getIndex(i, j, colCount) < completedTaskList.length"
                :value="completedTaskList[getIndex(i, j, colCount)]"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-window-item>
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
import UseTaskStore from '../store/taskStore'
import UseControlsStore from '../store/controlsStore'

const { smAndDown, sm, smAndUp, name } = useDisplay()
const controlsStore = UseControlsStore()
const taskStore = UseTaskStore()

const tab = ref('progress')

const activeTaskList = computed(() => {
  let activeTasks = []
  for (let task of taskStore.taskList) {
    if (task.status === 'running' || task.status === 'pending') {
      activeTasks.push(task)
    }
  }
  return activeTasks
})

const completedTaskList = computed(() => {
  return taskStore.taskList.filter((task) => task.status === 'completed')
})

const failedTaskList = computed(() => {
  return taskStore.taskList.filter((task) => task.status in ['error', 'failed', 'cancelled'])
})

const colCount = computed(() => {
  switch (name.value) {
    case 'xs':
      return 1
    case 'sm':
      return 2
    case 'md':
      return 2
    case 'lg': {
      return controlsStore.leftDrawer || controlsStore.rightDrawer ? 2 : 3
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
  if (tab.value === 'failed') {
    return Math.round(failedTaskList.value.length / colCount.value)
  } else if (tab.value === 'completed') {
    return Math.round(completedTaskList.value.length / colCount.value)
  } else {
    return Math.round(activeTaskList.value.length / colCount.value)
  }
})

const getIndex = (i, j, colCount) => {
  return (i - 1) * colCount + (j - 1)
}
</script>
