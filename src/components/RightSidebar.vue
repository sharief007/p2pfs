<template>
  <v-navigation-drawer app location="right" v-model="controlsStore.rightDrawer">
    <div class="d-flex flex-column" style="height: 100%">
      <div>
        <!--        <QRMatrix />-->
      </div>
      <div class="flex-grow-1">
        <Groups />
      </div>
    </div>
  </v-navigation-drawer>
</template>

<script setup>
import Groups from './GroupList.vue'

import UseControlsStore from '../store/controlsStore'

const controlsStore = UseControlsStore()
</script>
