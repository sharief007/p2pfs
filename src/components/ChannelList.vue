<template>
  <div class="d-flex flex-column h-100">
    <v-toolbar density="comfortable" :flat="true">
      <v-text-field
        class="mx-2"
        density="compact"
        :flat="true"
        hide-details
        placeholder="Search..."
        prepend-inner-icon="mdi-magnify"
        rounded
        variant="solo"
      ></v-text-field>
      <CreateChannel />
    </v-toolbar>
    <v-list v-model:selected="controlsStore.selectedChannel" :nav="true" :mandatory="true">
      <v-list-item
        v-for="(value, key) in webrtcStore.connectionsMetaData"
        density="compact"
        :key="key"
        :value="key"
        :active="
          controlsStore.selectedChannel &&
          (controlsStore.selectedChannel === key || controlsStore.selectedChannel[0] === key)
        "
      >
        <v-list-item-title>{{ value.channelName }}</v-list-item-title>
        <v-list-item-subtitle>{{ value.createdAt }}</v-list-item-subtitle>
        <template v-slot:prepend>
          <v-avatar density="compact" :image="value.avatar"></v-avatar>
        </template>
        <template v-slot:append>
          <v-list-item-action>
            <v-icon icon="mdi-information" size="small"></v-icon>
            <v-icon icon="mdi-trash-can"></v-icon>
          </v-list-item-action>
        </template>
      </v-list-item>
    </v-list>
  </div>
</template>

<script setup>
import CreateChannel from './CreateChannel.vue'

import UseWebRTCStore from '../store/webrtcStore'
import UseControlsStore from '../store/controlsStore'

const webrtcStore = UseWebRTCStore()
const controlsStore = UseControlsStore()

// const chanceSelection = (event) => {
//   controlsStore.setSelectedChannel(event.id)
// }
</script>
