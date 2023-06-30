<template>
  <v-navigation-drawer app location="right" v-model="controlsStore.rightDrawer">
    <div class="d-flex flex-column" style="height: 100%" fluid>
      <div>
        <QRMatrix />
      </div>
      <div class="flex-grow-1">
        <Groups />
      </div>
    </div>
  </v-navigation-drawer>
</template>

<script setup>
import Groups from './Groups.vue'
import QRMatrix from './QRMatrix.vue';

import useControlsStore from '../store/ui-controls'

const controlsStore = useControlsStore()
</script>
