<template>
  <v-hover v-slot="{ isHovering, props }">
    <v-card v-if="connectionsAvailable" v-bind="props">
      <v-img cover :lazySrc="qrCodeDataUrl" :src="qrCodeDataUrl">
        <v-expand-x-transition>
          <div
            v-if="isHovering"
            class="d-flex justify-center align-center bg-white"
            style="height: 100%; opacity: 0.9"
          >
            <v-btn icon flat><v-icon>mdi-share-variant</v-icon></v-btn>
            <v-btn icon flat><v-icon>mdi-content-copy</v-icon></v-btn>
            <v-btn icon flat><v-icon>mdi-download</v-icon></v-btn>
          </div>
        </v-expand-x-transition>
      </v-img>
    </v-card>
  </v-hover>
</template>

<script setup>
import { computed } from 'vue'

import UseControlsStore from '../store/controlsStore'
import UseWebRTCStore from '../store/webrtcStore'

// const controlStore = UseControlsStore()
const webrtcStore = UseWebRTCStore()
const controlsStore = UseControlsStore()

const connectionsAvailable = computed(() => {
  return Object.keys(webrtcStore.connectionsMap).length > 0
})

const qrCodeDataUrl = computed(() => {
  return webrtcStore.getQRCode(controlsStore.selectedChannel)
})
</script>
