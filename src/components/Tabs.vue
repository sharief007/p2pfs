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
          <v-row v-for="i in (taskList.length/(12 / colCount))" :key="i">
            <v-col v-for="j in colCount" :key="i" :col="(12 / colCount)">
              <Task />
            </v-col>
          </v-row>
        </v-container>
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
import { ref, computed } from 'vue'
import { useDisplay } from 'vuetify/lib/framework.mjs'

import Task from './Task.vue'
import { onMounted } from 'vue'

const tab = ref('progress')
const taskList = ref([])
const display = useDisplay()


const isMobile = () => {
  let { xs, xsAndDown } = display
  return (xsAndDown || xs || xsAndUp)
}

const isTablet = () => {
  let { xsAndUp, smAndDown, sm, smAndUp } = display
  return (xsAndUp || smAndDown || sm || smAndUp)
}

const isLaptop = () => {
  let { mdAndDown, md, mdAndUp } = display
  return ( mdAndDown || md || mdAndUp)
}

const isDesktop = () => {
  let { lgAndDown, lg, lgAndUp } = display
  return ( lgAndDown || lg || lgAndUp)
}

const isExtraLarge = () => {
  let { xlAndDown, xl, xlAndUp } = display
  return ( xlAndDown || xl || xlAndUp)
}

const colCount = computed(() => {
    if (isMobile()) {
      return 1
    } else if(isTablet()) {
      return 2
    } else if(isLaptop()) {
      return 3
    } else if(isDesktop()) {
      return 4
    } else {
      return 6
    }
})


onMounted(() => {
  for (let i = 0; i < 10; i++) {
    taskList.value.push(i)
  }
})
</script>
