import { defineStore } from 'pinia'
import QRCode from 'qrcode-svg'
import multiavatar from '@multiavatar/multiavatar'

const UseImageStore = defineStore('images', {
  actions: {
    convertSvgImageToDataURL(svgImg) {
      return 'data:image/svg+xml;base64,' + btoa(svgImg)
    },
    generateMultiAvatar(content) {
      const svgImg = multiavatar(content)
      return this.convertSvgImageToDataURL(svgImg)
    },
    generateQRCode(content) {
      const qrCode = new QRCode(content)
      const svgImg = qrCode.svg()
      return this.convertSvgImageToDataURL(svgImg)
    },
    dataURLtoBlob(dataurl) {
      let arr = dataurl.split(',')
      let mime = arr[0].match(/:(.*?);/)[1], baseString = atob(arr[1]), n = baseString.length
      let u8arr = new Uint8Array(n);
      while(n--){
        u8arr[n] = baseString.charCodeAt(n);
      }
      let blob = new Blob([u8arr], {type:mime});
      return new File([blob], 'QRCode.svg', { type: blob.type })
    }
  }
})

export default UseImageStore
