<template>
  <v-dialog v-model="controlsStore.qrReader" width="auto">
    <template v-slot:activator>
      <v-btn icon @click="controlsStore.showQRReader"><v-icon>mdi-data-matrix-scan</v-icon></v-btn>
    </template>
    <v-card>
      <v-card-text class="pa-0">
        <v-textarea
          :flat="true"
          :autofocus="true"
          hide-details
          variant="solo"
          :placeholder="placeholder"
          v-model="sdp"
        ></v-textarea>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="acceptOffer">accept offer</v-btn>
        <v-btn variant="text" @click="acceptAnswer">accept answer</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import UseControlsStore from '../store/controlsStore'
import UseWebRTCStore from '../store/webrtcStore'

import { ref } from 'vue'
const controlsStore = UseControlsStore()
const rtcStore = UseWebRTCStore()

const placeholder = ref('paste your sdp protocol information here')
const sdp = ref('')

const acceptOffer = () => {
  rtcStore.acceptOffer(sdp.value)
}

const acceptAnswer = () => {
  rtcStore.acceptAnswer(sdp.value)
}
</script>
