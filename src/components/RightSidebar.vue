<template>
  <v-navigation-drawer app location="right" v-model="controlsStore.rightDrawer">
    <div class="d-flex flex-column h-100">
      <v-list class="flex-grow-1 overflow-y-auto">
        <v-list-subheader>Pending file requests</v-list-subheader>
        <v-hover
          v-slot="{ isHovering, props }"
          v-for="(item, index) in controlsStore.notifications"
          :key="index"
        >
          <v-expand-x-transition>
            <v-list-item :title="item.fileName" :subtitle="item.fileSize" v-bind="props">
              <!-- <v-list-item-subtitle class="d-flex flex-no-wrap justify-space-between">
                <span>{{ item.fileType }}</span>
                <span>{{ item.fileSize }}</span>
              </v-list-item-subtitle> -->
              <template v-slot:prepend>
                <v-list-item-action :start="true">
                  <v-avatar
                    density="compact"
                    :image="webrtcStore.getAvatar(item.channelName)"
                  ></v-avatar>
                </v-list-item-action>
              </template>
              <template v-slot:append>
                <v-list-item-action v-if="isHovering">
                  <v-btn icon :flat="true" size="small" @click="acceptNotification(index)"
                    ><v-icon>mdi-check-bold</v-icon></v-btn
                  >
                  <v-btn
                    icon
                    :flat="true"
                    size="small"
                    @click="rejectNotification(index)"
                    ><v-icon>mdi-cancel</v-icon></v-btn
                  >
                </v-list-item-action>
              </template>
            </v-list-item>
          </v-expand-x-transition>
        </v-hover>
      </v-list>
    </div>
  </v-navigation-drawer>
</template>

<script setup>
import { v4 } from 'uuid'

import UseTaskStore from '../store/taskStore'
import UseWebRTCStore from '../store/webrtcStore'
import UseControlsStore from '../store/controlsStore'

const webrtcStore = UseWebRTCStore()
const controlsStore = UseControlsStore()
const taskStore = UseTaskStore()

const acceptNotification = (index) => {
  let metadata = controlsStore.notifications[index]
  controlsStore.popNotification(index)
  console.log(metadata)
  metadata.receiverId = v4()
  taskStore.acceptTask(metadata)
}

const rejectNotification = (index) => {
  let metadata = controlsStore.notifications[index]
  controlsStore.popNotification(index)
  console.log(metadata)
  taskStore.receiverTask(metadata)
}
</script>
