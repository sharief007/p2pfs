<template>
  <v-dialog v-model="controlsStore.createChannel" width="400" persistent="true">
    <template v-slot:activator>
      <v-btn icon @click="controlsStore.showCreateChannel" color="bg-primary">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>
    <v-card title="Create Channel">
      <v-container fluid="true">
        <v-row dense="true">
          <v-col cols="12" class="d-flex flex-column">
           <div class="d-flex justify-center">
             <v-avatar size="200" class="my-1" >
               <v-img :src="multiAvatar" v-if="multiAvatar.length > 26" />
               <v-icon icon="mdi-account" size="200" v-else></v-icon>
             </v-avatar>
           </div>
            <v-text-field label="Channel name" variant="solo"
                          :rules="channelNameRules" :readonly="channelNameReadOnly"
                          :flat="true" :autofocus="true" v-model="channelName" />
          </v-col>
        </v-row>
      </v-container>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="closeDialog">close</v-btn>
        <v-btn variant="text" :disabled="isDisabled || channelNameReadOnly" 
                @click="initConnection">create</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import {computed, ref} from "vue";

import UseControlsStore from "../store/controlsStore";
import UseImageStore from "../store/imageStore"
import UseWebRTCStore from "../store/webrtcStore";

const controlsStore = UseControlsStore()
const imageStore = UseImageStore()
const webrtcStore = UseWebRTCStore()

const rtcConnection = ref(null)
const channelName = ref('')
const channelNameReadOnly = ref(false)

const multiAvatar = computed(() => {
  return imageStore.generateMultiAvatar(channelName.value)
})

const mandatory = () => {
  return (!channelName.value || channelName.value.trim().length === 0) ? 'Channel name is required.' : true
}

const maxLength = (limit=15) => {
  return () => (channelName.value.trim().length >= limit) ? `Channel name cannot exceed ${limit} chars.` : true

}

const uniqueName = () => {
  let name = channelName.value.trim()
  return name in webrtcStore.connectionsMap ? 'Choose a new channel name.' : true
}

const channelNameRules = ref([mandatory, uniqueName, maxLength(15)])

const isDisabled = computed(() => {
  for (let validator of channelNameRules.value) {
    if(validator() !== true) {
      return true
    }
  }
  return false
})

const initConnection = async () => {
  channelNameReadOnly.value = true
  rtcConnection.value = await webrtcStore.initNewConnection(channelName.value, multiAvatar.value)
  await webrtcStore.createOffer(channelName.value, rtcConnection.value)

  closeDialog()
}

const resetDialogState = () => {
  channelNameReadOnly.value = false
  rtcConnection.value = null
  channelName.value = ""
}

const closeDialog = () => {
  controlsStore.hideCreateChannel()
  resetDialogState()
}

</script>

<style scoped>
</style>