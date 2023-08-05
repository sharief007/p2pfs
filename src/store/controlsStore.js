import { defineStore } from 'pinia'

const UseControlsStore = defineStore('controls', {
  state: () => ({
    notifications: [],
    leftDrawer: null,
    rightDrawer: null,
    sdpReader: false,
    createChannel: false,
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
    },
    pushNotification(channelName, message) {
      this.notifications.push({
        senderId: message.fileSenderId,
        fileName: message.fileName,
        fileType: message.fileType,
        fileSize: message.fileSize,
        rawSize: message.rawSize,
        channelName: Array.isArray(channelName) ? channelName[0] : channelName
      })
    },
    popNotification(index) {
      this.notifications.splice(index, 1)
    }
  }
})

export default UseControlsStore
