import { defineStore } from "pinia";
import QRCode from "qrcode-svg"
import multiavatar from "@multiavatar/multiavatar";

const UseImageStore = defineStore('images',  {
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
        }
    }
})

export default UseImageStore