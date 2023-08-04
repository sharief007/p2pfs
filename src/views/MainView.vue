<script setup>

import LeftSidebar from "@/components/LeftSidebar.vue";
import RightSidebar from "@/components/RightSidebar.vue";
import Tabs from "@/components/TabLayout.vue";
import SDPReader from "@/components/SDPReader.vue";
import FilePicker from "@/components/FilePicker.vue";
import UseControlsStore from "@/store/controlsStore";
import { computed } from "vue";

const controlsStore = UseControlsStore()

const showBadge = computed(() => {
  return controlsStore.notifications.length > 0
})

</script>

<template>
  <v-app id="inspire">
    <LeftSidebar />
    <RightSidebar />
    <v-app-bar :flat="true" :border="true" density="compact">
      <v-toolbar-title>P2PFS</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="controlsStore.toggleLeftDrawer">
        <v-icon>mdi-account-group</v-icon>
      </v-btn>
      <v-btn icon @click="controlsStore.toggleRightDrawer">
        <v-icon v-if="showBadge">mdi-bell-badge</v-icon>
        <v-icon v-else>mdi-bell</v-icon>
      </v-btn>
      <SDPReader />
      <FilePicker />
    </v-app-bar>
    <v-main>
      <Tabs />
    </v-main>
  </v-app>
</template>

<style scoped>

</style>