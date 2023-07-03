<template>
  <v-img :src="qrCodeDataUrl" />
</template>

<script setup>
import QRCode from 'qrcode-svg'
import { onMounted, ref, computed } from 'vue'
import usertcStore from '../store/webrtc'

const rtcStore = usertcStore()

const generateQRCode = (content) => {
  
  const qrcode = new QRCode({content})
  const svgImg = qrcode.svg()
  console.log(`generate qr triggered with`, content);
  return 'data:image/svg+xml;base64,' + btoa(svgImg)
}

const qrCodeDataUrl = computed(()=> {
  return generateQRCode(rtcStore.sdp)
})

</script>
