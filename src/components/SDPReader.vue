<template>
  <v-dialog
    v-model="controlsStore.sdpReader"
    width="400"
    height="500"
    :scrollable="true"
    :persistent="true"
  >
    <template v-slot:activator>
      <v-btn icon @click="controlsStore.showSDPReader"><v-icon>mdi-data-matrix-scan</v-icon></v-btn>
    </template>
    <v-card title="Accept offer/answer">
      <v-window v-model:model-value="steps" class="h-100">
        <v-window-item value="step-1" class="h-100">
          <v-list v-model:selected="sdpType" density="compact" :mandatory="true">
            <v-list-subheader title="Select SDP type"></v-list-subheader>
            <v-list-item
              v-for="(value, index) in ['offer', 'answer']"
              density="compact"
              :key="index"
              :value="value"
              :title="value"
            >
              <template v-slot:prepend="{ isActive }">
                <v-list-item-action>
                  <v-radio :model-value="isActive"></v-radio>
                </v-list-item-action>
              </template>
            </v-list-item>
          </v-list>
          <v-list v-model:selected="controlsStore.selectedChannel" :mandatory="true" class="h-100">
            <v-list-subheader title="Select the channel"></v-list-subheader>
            <v-list-item
              v-for="(value, key, index) in webrtcStore.connectionsMetaData"
              :key="index"
              :value="key"
              :title="value.channelName"
            >
              <template v-slot:prepend="{ isActive }">
                <v-list-item-action>
                  <v-radio :model-value="isActive"></v-radio>
                </v-list-item-action>
              </template>
            </v-list-item>
          </v-list>
        </v-window-item>
        <v-window-item value="step-2" class="h-100">
          <!--            <v-window v-model:model-value="inputType" :mandatory="true">-->
          <!--              <v-radio-group label="Select Input Type" :inline="true" density="compact" v-model:model-value="inputType">-->
          <!--                <v-radio density="compact" :inline="true" label="Camera" value="scanSDP"></v-radio>-->
          <!--                <v-radio density="compact" :inline="true" label="Paste" value="pasteSDP"></v-radio>-->
          <!--                <v-radio density="compact" :inline="true" label="Upload" value="uploadSDP"></v-radio>-->
          <!--              </v-radio-group>-->
          <!--              <V-window-item value="scanSDP">-->
          <!--                <video height="100%" width="100%" muted :src="userMedia"></video>-->
          <!--              </V-window-item>-->
          <!--              <v-window-item value="pasteSDP">-->
          <!--
                  <div class="d-flex flex-column h-100" style="background-color: green;">-->
          <v-list-subheader title="Paste the received SDP protocol" class="ml-4"></v-list-subheader>
          <v-textarea
            v-model:model-value="SDP"
            density="compact"
            placeholder="Type here..."
            :error-messages="errorMessages"
            variant="solo"
            :autofocus="true"
            :flat="true"
            :loading="loading"
            rows="14"
            no-resize
          ></v-textarea>
          <!--                </div>-->
          <!--              </v-window-item>-->
          <!--              <v-window-item value="uploadSDP">-->
          <!--                <v-file-input :flat="true" density="compact" ></v-file-input>-->
          <!--              </v-window-item>-->
          <!--            </v-window>-->
        </v-window-item>
      </v-window>
      <v-card-actions>
        <v-btn variant="text" prepend-icon="mdi-upload" @click="pickFile" v-if="steps === 'step-2'"
          >upload</v-btn
        >
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="resetAndClose" v-if="steps === 'step-1'">close</v-btn>
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

const SDP = ref('')
const steps = ref('step-1')
const sdpType = ref(null)
const errorMessages = ref('')
const loading = ref(false)

const resetAndClose = () => {
  controlsStore.hideSDPReader()
  steps.value = 'step-1'
  sdpType.value = null
  SDP.value = ''
  errorMessages.value = ''
  loading.value = false
}

const processSDP = async () => {
  let selectedChannel = controlsStore.selectedChannel
  const rtcConnection = webrtcStore.getRTCConnection(selectedChannel)
  if (sdpType.value === 'offer' || sdpType.value[0] === 'offer') {
    await webrtcStore.acceptOffer(selectedChannel, SDP.value)
    console.log('Offer Accepted')
  }
  if (sdpType.value === 'answer' || sdpType.value[0] === 'answer') {
    await webrtcStore.acceptAnswer(SDP.value, rtcConnection)
    console.log('Answer Accepted')
  }

  resetAndClose()
}

const pickFile = () => {
  loading.value = true
  const fileInput = document.createElement('input')
  const filereader = new FileReader()
  fileInput.type = 'file'
  fileInput.style.display = 'none'
  fileInput.onchange = (e) => {
    filereader.readAsText(e.target.files[0])
  }
  filereader.onload = (e) => {
    SDP.value = e.target.result
    loading.value = false
  }
  filereader.onerror = (e) => {
    errorMessages.value = e.target.error.message
  }
  fileInput.click()
}
</script>
