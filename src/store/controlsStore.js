import { defineStore } from 'pinia'

const UseControlsStore = defineStore('controls', {
  state: () => ({
    leftDrawer: null,
    rightDrawer: true,
    sdpReader: false,
    createChannel: false,
    channelNameReadOnly: false,
    selectedChannel: null,
    qrCodeModal: null,
    filePickerModal: null
  }),
  getters: {},
  actions: {
    toggleLeftDrawer() {
      this.leftDrawer = !this.leftDrawer
    },
    toggleRightDrawer() {
      this.rightDrawer = !this.rightDrawer
    },
    showSDPReader() {
      this.sdpReader = true
    },
    hideSDPReader() {
      this.sdpReader = false
    },
    showCreateChannel() {
      this.createChannel = true
    },
    hideCreateChannel() {
      this.createChannel = false
    },
    setSelectedChannel(name) {
      this.selectedChannel = name
    },
    showQRCodeModal() {
      this.qrCodeModal = true
    },
    showFilePickerModal() {
      this.filePickerModal = true
    },
    hideFilePickerModal() {
      this.filePickerModal = false
    }
  }
})

export default UseControlsStore
