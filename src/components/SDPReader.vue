<template>
  <v-dialog v-model="controlsStore.sdpReader" width="auto" :persistent="true">
    <template v-slot:activator>
      <v-btn icon @click="controlsStore.showSDPReader"><v-icon>mdi-data-matrix-scan</v-icon></v-btn>
    </template>
    <v-card title="Accept offer/answer">
        <v-window v-model:model-value="steps">
          <v-window-item value="step-1">
            <v-list v-model:selected="controlsStore.selectedChannel"
                    :nav="true" :mandatory="true" class="flex-grow-1 overflow-y-auto">
              <v-list-subheader title="Select SDP type"></v-list-subheader>
                <v-radio-group density="compact" v-model:model-value="inputType">
                <v-radio label="offer" value="offer"></v-radio>
                <v-radio label="answer" value="answer"></v-radio>
              </v-radio-group>
              <v-list-subheader title="Select the channel"></v-list-subheader>
                <v-list-item v-for="(value, key) in webrtcStore.connectionsMetaData"
                      density="compact" :value="key" :title="key">
                      <template v-slot:prepend="{ isActive }">
                          <v-list-item-action start>
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
const inputType = ref('offer')
const channelName = ref(null)

const placeholder = ref('paste your sdp protocol information here')
const processSDP = () => {

}
</script>
