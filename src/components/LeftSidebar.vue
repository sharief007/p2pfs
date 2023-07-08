<template>
  <v-navigation-drawer app v-model="controlsStore.leftDrawer">
    <div class="d-flex flex-column h-100">
      <div>
        <QRMatrix />
      </div>
      <div class="flex-grow-1 overflow-y-auto">
        <Channels />
      </div>
    </div>
  </v-navigation-drawer>
</template>

<script setup>
import Channels from './ChannelList.vue'

import UseControlsStore from '../store/controlsStore'
import QRMatrix from "./QRMatrix.vue";

const controlsStore = UseControlsStore()
</script>
