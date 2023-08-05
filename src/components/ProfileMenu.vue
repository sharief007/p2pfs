<script setup>
import { computed, ref } from 'vue'
import { getAuth, signOut } from 'firebase/auth'
import UseImageStore from '@/store/imageStore'

const menu = ref(false)
const imageStore = UseImageStore()

const imageSrc = computed(() => {
  const auth = getAuth()
  if (auth.currentUser && auth.currentUser.photoURL && auth.currentUser.photoURL !== '') {
    return auth.currentUser.photoURL
  }
  return imageStore.generateMultiAvatar(auth.currentUser.displayName)
})

const email = computed(() => {
  return getAuth().currentUser.email
})

const userName = computed(() => {
  return getAuth().currentUser.displayName
})

const logout = () => {
  signOut(getAuth()).catch(console.log)
}
</script>

<template>
  <v-menu v-model:model-value="menu" :close-on-content-click="false">
    <template v-slot:activator="{ props }">
      <v-btn :icon="true" :flat="true" v-bind="props"><v-icon>mdi-account-circle</v-icon></v-btn>
    </template>
    <template v-slot:default>
      <v-card>
        <v-list-item :title="userName" :subtitle="email" class="ma-1">
          <template v-slot:prepend>
            <v-avatar :image="imageSrc"></v-avatar>
          </template>
        </v-list-item>
        <v-divider></v-divider>
        <div class="d-flex flex-row-reverse">
          <v-btn
            @click="logout"
            variant="flat"
            prepend-icon="mdi-logout"
            style="text-transform: unset !important"
            >Logout</v-btn
          >
        </div>
      </v-card>
    </template>
  </v-menu>
</template>

<style scoped></style>
