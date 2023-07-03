import { defineStore } from 'pinia'

const useControlsStore = defineStore('controls', {
  state: () => ({
    leftDrawer: true,
    rightDrawer: true,
    qrReader: false
  }),
  getters: {},
  actions: {
    toggleLeftDrawer() {
      console.log('Fuck you')
      this.leftDrawer = !this.leftDrawer
    },
    toggleRightDrawer() {
      this.rightDrawer = !this.rightDrawer
    },
    showQRReader() {
      this.qrReader = true
    },
    hideQRReader() {
      this.qrReader = false
    }
  }
})

export default useControlsStore
