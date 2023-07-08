<template>
    <v-img :src="qrCodeDataUrl" v-if="connectionsAvailable"/>
</template>

<script setup>
import { computed } from 'vue'

import UseControlsStore from "../store/controlsStore";
import UseWebRTCStore from '../store/webrtcStore'

// const controlStore = UseControlsStore()
const webrtcStore = UseWebRTCStore()
const controlsStore = UseControlsStore()

const connectionsAvailable = computed(()=> {
  return Object.keys(webrtcStore.connectionsMap).length > 0
})

const qrCodeDataUrl = computed(()=> {
  return webrtcStore.getQRCode(controlsStore.selectedChannel)
})

</script>
