<template>
  <v-app id="inspire">
    <LeftSidebar />
    <RightSidebar />
    <v-app-bar flat border density="compact">
      <!-- <v-app-bar-nav-icon @click="controlsStore.toggleDrawer"></v-app-bar-nav-icon> -->
      <v-toolbar-title>P2P File Share</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="controlsStore.toggleLeftDrawer"><v-icon>mdi-account-group</v-icon></v-btn>
      <v-btn icon @click="controlsStore.toggleRightDrawer"
        ><v-icon>mdi-shield-refresh</v-icon></v-btn
      >
      <v-btn icon><v-icon>mdi-data-matrix-scan</v-icon></v-btn>
      <v-btn icon><v-icon>mdi-file-send</v-icon></v-btn>
    </v-app-bar>

    <v-main>
      <v-list density="compact" style="height: 100%">
        <TaskBar for="n in 10" :key="n" />
      </v-list>
      <v-bottom-navigation mode="shift" grow>
      <v-btn>
        <v-icon>mdi-television-play</v-icon>
        <span>Video</span>
      </v-btn>
      <v-btn>
        <v-icon>mdi-music-note</v-icon>
        <span>Music</span>
      </v-btn>
      <v-btn>
        <v-icon>mdi-book</v-icon>
        <span>Book</span>
      </v-btn>
      <v-btn>
        <v-icon>mdi-image</v-icon>
        <span>Image</span>
      </v-btn>
    </v-bottom-navigation>
    </v-main>
  </v-app>
</template>

<script setup>
import LeftSidebar from './components/LeftSidebar.vue'
import RightSidebar from './components/RightSidebar.vue'
import TaskBar from './components/TaskBar.vue'
import useControlsStore from './store/ui-controls'

const controlsStore = useControlsStore()
</script>
