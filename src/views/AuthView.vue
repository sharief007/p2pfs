<script setup>
import { getAuth, signInWithRedirect, GoogleAuthProvider, getRedirectResult } from 'firebase/auth'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const snackBar = ref(false)
const snackBarText = ref('')
const snackBarColor = ref('')
const disabled = ref(true)
const router = useRouter()
const googleSignIn = () => {
  signInWithRedirect(getAuth(), new GoogleAuthProvider())
}

onMounted(() => {
  getRedirectResult(getAuth())
    .then((user) => {
      disabled.value = false
      if (user) {
        snackBarColor.value = 'success'
        snackBarText.value = 'Authentication Successful.'
        snackBar.value = true
        router.push({ name: 'main' })
      }
    })
    .catch((err) => {
      disabled.value = false
      snackBarColor.value = 'red'
      snackBarText.value = `${err.code} - Authentication failed`
      snackBar.value = true
    })
})
</script>

<template>
  <div class="d-flex flex-column align-center justify-center" style="height: 100vh">
    <v-btn
      color="red"
      class="ma-2"
      prepend-icon="mdi-google"
      width="300"
      @click="googleSignIn"
      :disabled="disabled"
      >SignIn with Google</v-btn
    >
    <v-snackbar v-model:model-value="snackBar" :color="snackBarColor" variant="tonal">
      <template v-slot:default>
        {{ snackBarText }}
      </template>
    </v-snackbar>
  </div>
</template>

<style scoped></style>
