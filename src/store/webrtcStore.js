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
    },
    getDataChannel(state) {
      return (channelName) => state.dataChannelMap[channelName]
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
        // const dataChannelSet = this.dataChannelMap[channelName] || new Set()
        const dataChannel = e.channel
        dataChannel.onopen = async (e) => {
          console.log(`Data channel opened`, JSON.stringify(e))
          setInterval(()=> {
            dataChannel.send(new Date().toLocaleTimeString())
          }, 3000)
        }

        dataChannel.onmessage = (e) => {
          // let data = new TextDecoder().decode(e.data)
          console.log(`Received a message from ${channelName}: ${e.data}`)
        }

        // dataChannelSet.add(dataChannel)
        this.dataChannelMap[channelName] = dataChannel
      }

      connection.onconnectionstatechange = (e) => {
        console.log(e)
        this.connectionsMetaData[channelName]['connectionState'] = connection.connectionState
      }

      this.connectionsMap[channelName] = connection
      return connection
    },
    async initNewConnection(channelName, multiAvatar) {
      const controlsStore = UseControlsStore()
      const rtcConnection = await this._newConnection(channelName)
      console.log(rtcConnection)
      this.connectionsMetaData[channelName] = {
        channelName: channelName,
        qrCode: null,
        localDescription: '',
        connectionState: rtcConnection.connectionState,
        avatar: multiAvatar,
        createdAt: Date.now()
      }
      controlsStore.setSelectedChannel(channelName)
      return rtcConnection
    },
    async createOffer(channelName, rtcConnection) {
      const dataChannel = await this.createDataChan(channelName, rtcConnection)
      // const dataChannelSet = this.dataChannelMap[channelName] || new Set()
      // dataChannelSet.add(dataChannel)
      this.dataChannelMap[channelName] = dataChannel

      let offer = await rtcConnection.createOffer()
      console.log(`Offer Created`)
      await rtcConnection.setLocalDescription(offer)
    },
    async createDataChan(label, rtcConnection) {
      const dataChannel = await rtcConnection.createDataChannel(label)
      dataChannel.onopen = async (e) => {
        console.log(`Data channel opened`, JSON.stringify(e))

        setInterval(()=> {
          dataChannel.send(new Date().toLocaleTimeString())
        }, 3000)
      }

      dataChannel.onmessage = async (e) => {
        console.log(`Received new Message ${label}: ${e.data}`)
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
    },
    async acceptAnswer(answer, rtcConnection) {
      answer = JSON.parse(answer)
      await rtcConnection.setRemoteDescription(answer)
      console.log(`remote description set.`)
    }
  }
})
export default UseWebRTCStore
