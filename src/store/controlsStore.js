import { defineStore } from 'pinia'

const UseControlsStore = defineStore('controls', {
  state: () => ({
    leftDrawer: true,
    rightDrawer: true,
    qrReader: false,
    createChannel : false,
    selectedChannel: 0
  }),
  getters: {},
  actions: {
    toggleLeftDrawer() {
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
    },
    showCreateChannel() {
      this.createChannel = true
    },
    hideCreateChannel() {
      this.createChannel = false
    },
    setSelectedChannel(name) {
      this.selectedChannel = name
    }
  }
})

export default UseControlsStore
