<template>
  <v-img :src="qrCodeDataUrl" />
</template>

<script setup>
import QRCode from 'qrcode-svg'
import { onMounted, ref, computed } from 'vue'

const localConnection = new RTCPeerConnection()
const qrCodeDataUrl = ref('')

const generateQRCode = (content) => {
  const qrcode = new QRCode({content})
  const svgImg = qrcode.svg()

  return 'data:image/svg+xml;base64,' + btoa(svgImg)
}

onMounted(async () => {
  localConnection.onicecandidate = (e) => {
    let ice = JSON.stringify(localConnection.localDescription)
    qrCodeDataUrl.value = generateQRCode(ice)
    console.log(ice);
  }
  const offer = await localConnection.createOffer()
  let offerStr = JSON.stringify(offer)
  console.log(`offer created`, offerStr);
  qrCodeDataUrl.value = generateQRCode(offerStr)
  localConnection.setLocalDescription(offer);
})
</script>
