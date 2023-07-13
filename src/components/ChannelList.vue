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
    <v-list v-model:selected="controlsStore.selectedChannel" density="compact"
           :mandatory="true" class="flex-grow-1 overflow-y-auto ">
      <v-list-item lines="one"
        v-for="(value, key, index) in webrtcStore.connectionsMetaData"
        :key="index"
        :value="key"
        :active="
          controlsStore.selectedChannel &&
          (controlsStore.selectedChannel === key || controlsStore.selectedChannel[0] === key)
        "
        :title="value.channelName"
        density="compact"
      >
<!--        <v-list-item-title>{{ value.channelName }}</v-list-item-title>-->
<!--        <v-list-item-subtitle>{{ value.state }}</v-list-item-subtitle>-->
        <template v-slot:prepend>
          <v-list-item-action :start="true">
            <v-badge :dot="true" color="success" location="bottom end">
              <v-avatar density="compact" :image="value.avatar"></v-avatar>
            </v-badge>
          </v-list-item-action>
        </template>
        <template v-slot:append>
          <v-list-item-action :end="true">
            <v-icon icon="mdi-trash-can" @click="discardConnection"></v-icon>
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

const discardConnection = (event) => {
  console.log(event)
}
</script>
