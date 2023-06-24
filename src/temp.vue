<script>
import { ref, computed } from 'vue'
import network from './peers'

export default {
  setup() {
    const remotePeerId = ref('')
    const message = ref('')
    const myPeerId = computed(() => network.peerId)
    const connect = () => {
      console.log('HEREEEEE', remotePeerId.value)
      network.connectTo(remotePeerId.value)
    }
    const send = async () => {
      const [fileHandle] = await window.showOpenFilePicker()
      const file = await fileHandle.getFile()
      let reader = new FileReader(file)
      reader.onload = () => {
        network.sendData(remotePeerId.value, reader.result)
      }
      reader.readAsText(file)
    }

    return {
      remotePeerId,
      message,
      connect,
      send,
      myPeerId
    }
  }
}
</script>

<template>
  <v-app id="inspire">
    <v-navigation-drawer>
      <v-img
        class="mx-auto"
        height="300"
        lazy-src="https://th.bing.com/th/id/OIP.4tBoNkjeevqE1XLk9qsVGQHaF7?w=216&h=180&c=7&r=0&o=5&pid=1.7"
        max-width="500"
        src="https://th.bing.com/th/id/OIP.4tBoNkjeevqE1XLk9qsVGQHaF7?w=216&h=180&c=7&r=0&o=5&pid=1.7"
      >
        <template v-slot:placeholder>
          <div class="d-flex align-center justify-center fill-height">
            <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
          </div>
        </template>
      </v-img>

      <div class="ma-2">
        <v-text-field
          clearable
          label="Remote Peer Id"
          variant="solo"
          v-model="remotePeerId"
        ></v-text-field>
        <v-textarea
          name="input-7-1"
          variant="filled"
          label="Label"
          auto-grow
          v-model="message"
        ></v-textarea>
        <v-btn block @click="connect">connect</v-btn>
        <v-btn block @click="send">send</v-btn>
      </div>
    </v-navigation-drawer>

    <v-app-bar>
      <v-app-bar-title>{{ myPeerId }}</v-app-bar-title>
    </v-app-bar>

    <v-main><!--  --></v-main>

    <v-navigation-drawer location="right">
      <v-list>
        <v-list-item v-for="n in 5" :key="n" :title="`Item ${n}`" link> </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-footer app height="72">
      <v-text-field
        bg-color="grey-lighten-1"
        class="rounded-pill overflow-hidden"
        density="compact"
        hide-details
        variant="solo"
      ></v-text-field>
    </v-footer>
  </v-app>
</template>

<style scoped></style>
