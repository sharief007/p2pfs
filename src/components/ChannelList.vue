<template>
  <div class="d-flex flex-column h-100">
    <v-toolbar density="comfortable" :flat="true">
      <v-text-field
        v-model="filter"
        class="mx-2"
        density="compact"
        :flat="true"
        :hide-details="true"
        placeholder="Search..."
        prepend-inner-icon="mdi-magnify"
        :rounded="true"
        variant="solo"
        :clearable="true"
      ></v-text-field>
      <CreateChannel />
    </v-toolbar>
    <v-list
      v-model:selected="controlsStore.selectedChannel"
      density="compact"
      :mandatory="true"
      class="flex-grow-1 overflow-y-auto"
    >
      <v-list-item
        lines="one"
        v-for="(value, index) in filteredChannelList"
        :key="index"
        :value="value.channelName"
        :active="
          controlsStore.selectedChannel &&
          (controlsStore.selectedChannel === value.channelName ||
            controlsStore.selectedChannel[0] === value.channelName)
        "
        :title="value.channelName"
        :subtitle="value.connectionState === 'new' ? 'created' : value.connectionState"
        density="compact"
      >
        <template v-slot:prepend>
          <v-list-item-action :start="true">
            <v-badge :dot="true" :color="value.color" location="bottom end">
              <v-avatar density="compact" :image="value.avatar"></v-avatar>
            </v-badge>
          </v-list-item-action>
        </template>
        <!-- <template v-slot:append>
          <v-list-item-action :end="true">
            <v-icon icon="mdi-trash-can" @click="discardConnection"></v-icon>
          </v-list-item-action>
        </template> -->
      </v-list-item>
    </v-list>
  </div>
</template>

<script setup>
import CreateChannel from './CreateChannel.vue'

import UseWebRTCStore from '../store/webrtcStore'
import UseControlsStore from '../store/controlsStore'
import { ref, computed } from 'vue'

const webrtcStore = UseWebRTCStore()
const controlsStore = UseControlsStore()

const filter = ref('')

const filteredChannelList = computed(() => {
  let filteredChannels = []
  for (let channelMetaData of Object.values(webrtcStore.connectionsMetaData)) {
    if(filterRegex(channelMetaData.channelName)) {
      channelMetaData['color'] = getColorFromState(channelMetaData.connectionState)
      filteredChannels.push(channelMetaData)
    }
  }
  return filteredChannels
})

const filterRegex = (channelName) => {
  let regex = Array.from(filter.value || '').join('.*')
  let pattern = new RegExp(regex, 'i')
  return pattern.test(channelName)
}

const getColorFromState = (connectionState) => {
  switch (connectionState) {
    case 'connected':
      return 'green'
    case 'connecting':
      return 'orange'
    case 'disconnected':
    case 'failed':
    case 'closed':
      return 'red'
    default:    // new
      return 'blue'
  }
}

// const discardConnection = (event) => {
//   console.log(event)
// }
</script>
