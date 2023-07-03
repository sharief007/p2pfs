<template>
  <v-navigation-drawer app v-model="controlsStore.leftDrawer">
    <div class="d-flex flex-column" style="height: 100%" fluid>
      <div>
        <KeyPair />
      </div>
      <div class="flex-grow-1 overflow-y-auto">
        <Channels />
      </div>
    </div>
  </v-navigation-drawer>
</template>

<script setup>
import KeyPair from './KeyPair.vue';
import Channels from './Channels.vue'

import useControlsStore from '../store/ui-controls'

const controlsStore = useControlsStore()
</script>
