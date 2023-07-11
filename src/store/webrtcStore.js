import { defineStore } from 'pinia'
import UseImageStore from './imageStore'
import UseControlsStore from './controlsStore'

const UseWebRTCStore = defineStore('webrtc', {
  state: () => ({
    configuration: {
      configuration: {
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      },
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    },
    connectionsMetaData: {},
    connectionsMap: {},
    dataChannelMap: {}
  }),
  getters: {
    getAvatar(state) {
      return (channelName) => {
        let metadata = state.connectionsMetaData[channelName] || {}
        return metadata['avatar']
      }
    },
    getQRCode(state) {
      return (channelName) => {
        let metadata = state.connectionsMetaData[channelName] || {}
        return metadata['qrCode']
      }
    },
    getRTCConnection(state) {
      return (channelName) => state.connectionsMap[channelName]
    },
    getLocalDescription(state) {
      return (channelName) => state.connectionsMetaData[channelName]['localDescription']
    }
  },
  actions: {
    async _newConnection(channelName) {
      delete this.connectionsMap[channelName]
      delete this.dataChannelMap[channelName]

      const imageStore = UseImageStore()
      const connection = new RTCPeerConnection()

      connection.onicecandidate = () => {
        let sdpString = JSON.stringify(connection.localDescription)
        this.connectionsMetaData[channelName]['localDescription'] = sdpString
        this.connectionsMetaData[channelName]['qrCode'] = imageStore.generateQRCode(sdpString)
        console.log(sdpString)
      }

      connection.ondatachannel = (e) => {
        const dataChannelSet = this.dataChannelMap[channelName] || new Set()
        const dataChannel = e.channel
        dataChannel.onopen = async (e) => {
          console.log(`Data channel opened`, JSON.stringify(e))
        }

        dataChannel.onmessage = (e) => {
          // let data = new TextDecoder().decode(e.data)
          console.log(e)
        }

        dataChannelSet.add(dataChannel)
        this.dataChannelMap[channelName] = dataChannelSet
      }
      this.connectionsMap[channelName] = connection
      return connection
    },
    async initNewConnection(channelName, multiAvatar) {
      const controlsStore = UseControlsStore()
      const rtcConnection = this._newConnection(channelName)
      this.connectionsMetaData[channelName] = {
        channelName: channelName,
        qrCode: null,
        localDescription: '',
        avatar: multiAvatar,
        createdAt: Date.now()
      }
      controlsStore.setSelectedChannel(channelName)
      return rtcConnection
    },
    async createOffer(channelName, rtcConnection) {
      let label = `${channelName}-${Date.now()}`
      const dataChannel = await this.createDataChan(label, rtcConnection)
      const dataChannelSet = this.dataChannelMap[channelName] || new Set()
      dataChannelSet.add(dataChannel)
      this.dataChannelMap[channelName] = dataChannelSet

      let offer = await rtcConnection.createOffer()
      console.log(`Offer Created`)
      await rtcConnection.setLocalDescription(offer)
    },
    async createDataChan(label, rtcConnection) {
      const dataChannel = await rtcConnection.createDataChannel(label)
      dataChannel.onopen = async (e) => {
        console.log(`Data channel opened`, JSON.stringify(e))

        setInterval(()=> {
          console.log(dataChannel)
          dataChannel.send("Wasssuppp")
        }, 3000)
      }

      dataChannel.onmessage = async (e) => {
        console.log(`Received new Message`, e.data)
      }
      return dataChannel
    },
    async acceptOffer(channelName, offerString) {
      const rtcConnection = await this._newConnection(channelName)
      const offer = JSON.parse(offerString)
      console.log(offerString, offer)
      await rtcConnection.setRemoteDescription(offer)
      console.log("Remote description set, creating answer")
      let answer = await rtcConnection.createAnswer()
      await rtcConnection.setLocalDescription(answer)
      this.sdp = JSON.stringify(rtcConnection.localDescription)
      console.log(`answer created`, JSON.stringify(rtcConnection.localDescription))

      setInterval(()=>{
        console.log( this.dataChannelMap[channelName])
        // datachan.send(new Date().toDateString())
      }, 3000)
    },
    async acceptAnswer(answer, rtcConnection) {
      answer = JSON.parse(answer)
      await rtcConnection.setRemoteDescription(answer)
      console.log(`remote description set.`)
    }
  }
})
export default UseWebRTCStore
