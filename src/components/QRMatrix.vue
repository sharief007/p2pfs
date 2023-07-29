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
            <v-btn icon :flat="true" @click="shareContent" v-if="isWebShareSupported"
              ><v-icon>mdi-share-variant</v-icon></v-btn
            >
            <v-btn icon :flat="true" @click="copyContent"><v-icon>mdi-content-copy</v-icon></v-btn>
            <v-btn icon :flat="true" @click="downloadContent"><v-icon>mdi-download</v-icon></v-btn>
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
import UseImageStore from '../store/imageStore';

const webrtcStore = UseWebRTCStore()
const controlsStore = UseControlsStore()

const connectionsAvailable = computed(() => {
  return Object.keys(webrtcStore.connectionsMap).length > 0
})

const qrCodeDataUrl = computed(() => {
  return webrtcStore.getQRCode(controlsStore.selectedChannel)
})

const isWebShareSupported = computed(() => {
  return 'share' in navigator && 'canShare' in navigator
})

const getSDP = () => {
  return webrtcStore.getLocalDescription(controlsStore.selectedChannel)
}

const copyContent = async () => {
  await navigator.clipboard.writeText(getSDP())
}

const shareContent = async () => { 
  await navigator.share({
      title: 'Session Description',
      text: getSDP()
  })
}

const downloadContent = async () => {
  let fileName = `SDP_${Date.now()}.json`
  let file = new File([getSDP()], fileName, { type: "application/json"})
  let anchor = document.createElement('a')
  anchor.href = URL.createObjectURL(file)
  anchor.download = fileName
  anchor.click()
  URL.revokeObjectURL(anchor.href)
}
</script>
