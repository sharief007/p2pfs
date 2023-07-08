<template>
  <v-app id="inspire">
    <LeftSidebar />
<!--    <RightSidebar />-->
    <v-app-bar :flat="true" border density="compact">
      <v-toolbar-title>P2PFS</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="controlsStore.toggleLeftDrawer">
        <v-icon>mdi-account-group</v-icon>
      </v-btn>
      <v-btn icon @click="controlsStore.toggleRightDrawer">
        <v-icon>mdi-shield-refresh</v-icon>
      </v-btn>
      <QRReader />
      <v-btn icon><v-icon>mdi-file-send</v-icon></v-btn>
    </v-app-bar>
    <v-main>
      <Tabs />
    </v-main>
  </v-app>
</template>

<script setup>
import LeftSidebar from './components/LeftSidebar.vue'
// import RightSidebar from './components/RightSidebar.vue'
import Tabs from './components/TabLayout.vue'
import QRReader from './components/QRReader.vue'

import UseControlsStore from './store/controlsStore'

const controlsStore = UseControlsStore()

</script>
