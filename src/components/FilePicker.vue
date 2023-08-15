<template>
  <v-dialog width="auto" min-width="600" :persistent="true" v-model:model-value="controlsStore.filePickerModal">
    <template v-slot:activator>
      <v-btn icon @click="controlsStore.showFilePickerModal"
        ><v-icon>mdi-file-arrow-up-down</v-icon></v-btn
      >
    </template>
    <v-card :hover="true" class="d-flex flex-column h-100">
      <v-window v-model:model-value="steps">
        <v-window-item value="step-1">
          <v-table height="600" density="compact" fixed-header class="flex-grow-1">
            <thead>
              <tr>
                <th class="text-left">Selected</th>
                <th class="text-left">File Name</th>
                <th class="text-left">File Type</th>
                <th class="text-left">File Size</th>
              </tr>
            </thead>
            <tbody class="h-100 overflow-y-auto">
              <tr
                v-for="(item, i) in selectedFiles"
                :key="item"
                :class="item.isSelected ? 'bg-grey-lighten-1' : ''"
              >
                <td>
                  <v-checkbox-btn
                    density="compact"
                    v-model:model-value="selectedFiles[i].isSelected"
                    :inline="true"
                  />
                </td>
                <td>{{ item.content.name }}</td>
                <td>{{ item.content.type }}</td>
                <td>{{ item.fileSize }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-window-item>
        <v-window-item value="step-2">
          <v-list
            density="compact"
            height="600"
            :mandatory="true"
            v-model:selected="selectedChannels"
          >
            <v-list-subheader title="Select the target channel"></v-list-subheader>
            <v-list-item
              v-for="(channelName, index) in connectedChannels"
              :key="index"
              :value="channelName"
              :title="channelName"
            >
              <template v-slot:prepend="{ isActive }">
                <v-list-item-action>
                  <v-radio :model-value="isActive"></v-radio>
                </v-list-item-action>
              </template>
            </v-list-item>
          </v-list>
        </v-window-item>
      </v-window>
      <v-card-actions>
        <v-btn variant="text" prepend-icon="mdi-upload" @click="pickFiles" v-if="steps === 'step-1'"
          >choose files</v-btn
        >
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="controlsStore.hideFilePickerModal" v-if="steps === 'step-1'"
          >close</v-btn
        >
        <v-btn variant="text" @click="steps = 'step-2'" v-if="steps === 'step-1'">next</v-btn>
        <v-btn variant="text" @click="steps = 'step-1'" v-if="steps === 'step-2'">previous</v-btn>
        <v-btn variant="text" @click="submitTask" v-if="steps === 'step-2'">submit</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { v4 } from 'uuid'

import UseControlsStore from '../store/controlsStore'
import UseImageStore from '../store/imageStore'
import UseWebRTCStore from '../store/webrtcStore'
import UseTaskStore from '../store/taskStore'

const controlsStore = UseControlsStore()
const imageStore = UseImageStore()
const webrtcStore = UseWebRTCStore()
const taskStore = UseTaskStore()

const selectedChannels = ref([])
const selectedFiles = ref([])
const steps = ref('step-1')

const _fileHandler = (event) => {
  const filesList = event.target.files
  for (let file of filesList) {
    selectedFiles.value.push({
      content: file,
      fileSize: imageStore.convertFileSize(file.size),
      isSelected: true
    })
  }
}
const pickFiles = () => {
  const fileInput = document.createElement('input')
  fileInput.type = 'file'
  fileInput.setAttribute('multiple', '')
  fileInput.style.display = 'none'
  fileInput.onchange = _fileHandler
  fileInput.click()
}

const connectedChannels = computed(() => {
  let filteredChannels = []
  for(let channelMetaData of Object.values(webrtcStore.connectionsMetaData)) {
    if (channelMetaData.connectionState === 'connected') {
      filteredChannels.push(channelMetaData.channelName)
    }
  }
  return filteredChannels
})

const submitTask = () => {
  let filesToSubmit = []
  for (let fileMetaData of selectedFiles.value) {
    if (fileMetaData.isSelected) {
      fileMetaData.senderId = v4()
      filesToSubmit.push(fileMetaData)
    }
  }
  taskStore.createTask(filesToSubmit, selectedChannels.value[0])
}
</script>

<style scoped></style>
