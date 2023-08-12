import { defineStore } from 'pinia'
import UseImageStore from './imageStore'
import UseControlsStore from './controlsStore'
import UseTaskStore from './taskStore'

import { MessageType } from '../models/models'

const UseWebRTCStore = defineStore('webrtc', {
  state: () => ({
    // configuration: {
    //   configuration: {
    //     offerToReceiveAudio: true,
    //     offerToReceiveVideo: true
    //   },
    //   iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    // },
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
    _newConnection(channelName) {
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
        this.initDataChannel(dataChannel, channelName)
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
    initDataChannel(dataChannel, channelName) {
      const controlsStore = UseControlsStore()
      const taskStore = UseTaskStore()

      dataChannel.onopen = (e) => {
        console.log(`Data channel opened`, JSON.stringify(e))
        setInterval(() => {
          let message = JSON.stringify({ date: new Date().toLocaleTimeString() })
          dataChannel.send(message)
        }, 3000)
      }

      dataChannel.onmessage = (e) => {
        const message = JSON.parse(e.data)
        switch (message.type) {
          case MessageType.FILE_REQUEST: {
            
            controlsStore.pushNotification(channelName, message)
            break
          }
          case MessageType.FILE_RESPONSE: {
            taskStore.processResponse(channelName, message)
            break
          }
          default: {
            taskStore.processData(channelName, message)
          }
        }
        console.log(`Received a message from ${channelName}: ${e.data}`)
      }
    },
    initNewConnection(channelName, multiAvatar) {
      const controlsStore = UseControlsStore()
      const rtcConnection = this._newConnection(channelName)
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
      // const dataChannelSet = this.dataChannelMap[channelName] || new Set()
      // dataChannelSet.add(dataChannel)
      this.dataChannelMap[channelName] = await this.createDataChan(channelName, rtcConnection)

      let offer = await rtcConnection.createOffer()
      console.log(`Offer Created`)
      await rtcConnection.setLocalDescription(offer)
    },
    async createDataChan(channelName, rtcConnection) {
      const dataChannel = await rtcConnection.createDataChannel(channelName)
      this.initDataChannel(dataChannel, channelName)
      return dataChannel
    },
    async acceptOffer(channelName, offerString) {
      const rtcConnection = this._newConnection(channelName)
      const offer = JSON.parse(offerString)
      console.log(offerString, offer)
      await rtcConnection.setRemoteDescription(offer)
      console.log('Remote description set, creating answer')
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
