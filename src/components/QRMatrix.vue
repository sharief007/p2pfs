<template>
  <v-hover v-slot="{ isHovering, props }">
    <v-card v-if="connectionsAvailable" v-bind="props">
      <v-img :cover="true" :lazySrc="qrCodeDataUrl" :src="qrCodeDataUrl">
        <v-expand-x-transition>
          <div
            v-if="isHovering"
            class="d-flex justify-center align-center bg-white"
            style="height: 100%; opacity: 0.9"
          >
            <v-btn icon :flat="true" @click="shareContent" v-if="canShare"><v-icon>mdi-share-variant</v-icon></v-btn>
            <v-btn icon :flat="true" @click="copyContent"><v-icon>mdi-content-copy</v-icon></v-btn>
            <v-btn icon :flat="true"><v-icon>mdi-download</v-icon></v-btn>
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

const webrtcStore = UseWebRTCStore()
const controlsStore = UseControlsStore()

const connectionsAvailable = computed(() => {
  return Object.keys(webrtcStore.connectionsMap).length > 0
})

const qrCodeDataUrl = computed(() => {
  return webrtcStore.getQRCode(controlsStore.selectedChannel)
})

const copyContent = async () => {
  let channelName = controlsStore.selectedChannel
  let sessionDescription = webrtcStore.getLocalDescription(channelName)
  await navigator.clipboard.writeText(sessionDescription)
}

const shareContent = async () => {
  let channelName = controlsStore.selectedChannel
  let sessionDescription = webrtcStore.getLocalDescription(channelName)

  await navigator.share({
    title: "SDP",
    url: window.location.href,
    text: sessionDescription
  })
}
</script>
