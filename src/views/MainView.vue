<script setup>
import LeftSidebar from '@/components/LeftSidebar.vue'
import RightSidebar from '@/components/RightSidebar.vue'
import Tabs from '@/components/TabLayout.vue'
import SDPReader from '@/components/SDPReader.vue'
import FilePicker from '@/components/FilePicker.vue'
import UseControlsStore from '@/store/controlsStore'
import { computed, onMounted } from 'vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'vue-router'
import ProfileMenu from '@/components/ProfileMenu.vue'

const controlsStore = UseControlsStore()
const router = useRouter()

const showBadge = computed(() => {
  return controlsStore.notifications.length > 0
})

onMounted(() => {
  console.log(getAuth())
  onAuthStateChanged(getAuth(), (user) => {
    if (!user) {
      router.push({ name: 'auth' })
    }
  })
})
</script>

<template>
  <v-app id="inspire">
    <LeftSidebar />
    <RightSidebar />
    <v-app-bar :flat="true" :border="true" density="compact" title="P2PFS">
      <v-btn icon @click="controlsStore.toggleLeftDrawer">
        <v-icon>mdi-account-group</v-icon>
      </v-btn>
      <v-btn icon @click="controlsStore.toggleRightDrawer">
        <v-icon v-if="showBadge">mdi-bell-badge</v-icon>
        <v-icon v-else>mdi-bell</v-icon>
      </v-btn>
      <SDPReader />
      <FilePicker />
      <ProfileMenu />
    </v-app-bar>
    <v-main>
      <Tabs />
    </v-main>
  </v-app>
</template>

<style scoped></style>
