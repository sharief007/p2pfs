<template>
  <v-img :src="qrCodeDataUrl" />
</template>

<script setup>
import QRCode from 'qrcode-svg'
import { onMounted, ref } from 'vue'

const qrCodeDataUrl = ref('')
onMounted(() => {
  const qrcode = new QRCode({
    content: 'Hello World'
  })
  const svgImg = qrcode.svg()
  qrCodeDataUrl.value = 'data:image/svg+xml;base64,' + btoa(svgImg)

  if ('BarcodeDetector' in window) {
    const qrCodeDetector = new BarcodeDetector({
      formats: ['qr_code']
    })

    qrCodeDetector
      .detect(qrCodeDataUrl)
      .then((codes) => {
        console.log(codes)
      })
      .catch(console.error)
  } else {
    console.log('BarCode detector not supported')
  }
})
</script>
