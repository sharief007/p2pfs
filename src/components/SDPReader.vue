<template>
  <v-dialog v-model="controlsStore.sdpReader" width="400" height="500" :scrollable="true" :persistent="true">
    <template v-slot:activator>
      <v-btn icon @click="controlsStore.showSDPReader"><v-icon>mdi-data-matrix-scan</v-icon></v-btn>
    </template>
    <v-card title="Accept offer/answer">
        <v-window v-model:model-value="steps" class="h-100">
          <v-window-item value="step-1" class="h-100">
              <v-list v-model:selected="inputType" density="compact" :mandatory="true">
                <v-list-subheader title="Select SDP type"></v-list-subheader>
                <v-list-item v-for="(value, index) in ['offer', 'answer']"
                             density="compact" :key="index" :value="value" :title="value">
                  <template v-slot:prepend="{ isActive }">
                    <v-list-item-action>
                      <v-radio :model-value="isActive"></v-radio>
                    </v-list-item-action>
                  </template>
                </v-list-item>
              </v-list>
              <v-list v-model:selected="controlsStore.selectedChannel"
                      :mandatory="true" class="h-100">
                <v-list-subheader title="Select the channel"></v-list-subheader>
                <v-list-item v-for="(value, key, index) in webrtcStore.connectionsMetaData"
                             :key="index" :value="key" :title="value.channelName">
                  <template v-slot:prepend="{ isActive }">
                    <v-list-item-action>
                      <v-radio :model-value="isActive"></v-radio>
                    </v-list-item-action>
                  </template>
                </v-list-item>
              </v-list>
          </v-window-item>
          <v-window-item value="step-2" style="background-color: green;">

          </v-window-item>
        </v-window>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="controlsStore.hideSDPReader" v-if="steps === 'step-1'">close</v-btn>
        <v-btn variant="text" @click="steps = 'step-2'" v-if="steps === 'step-1'">next</v-btn>
        <v-btn variant="text" @click="steps = 'step-1'" v-if="steps === 'step-2'">previous</v-btn>
        <v-btn variant="text" @click="processSDP" v-if="steps === 'step-2'">confirm</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import UseControlsStore from '../store/controlsStore'
import UseWebRTCStore from '../store/webrtcStore'

import { ref } from 'vue'
const controlsStore = UseControlsStore()
const webrtcStore = UseWebRTCStore()

const steps = ref('step-1')
const inputType = ref()

// const placeholder = ref('paste your sdp protocol information here')
const processSDP = () => {

}
</script>
