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
    },
    convertFileSize(bytes) {
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      if (bytes === 0) return '0 Byte'
      const i = Math.floor(Math.log(bytes) / Math.log(1024))
      const value = bytes / Math.pow(1024, i)
      // round value to two decimals
      const size = Math.round( value * 100) / 100
      return size + ' ' + sizes[i]
    }
  }
})

export default UseImageStore
