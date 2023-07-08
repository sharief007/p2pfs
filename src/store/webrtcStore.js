import {defineStore} from 'pinia'
import UseImageStore from "./imageStore";
import UseControlsStore from "./controlsStore";

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
        connectionsMap : {},
        dataChannelMap: {},
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
      }
    },
    actions: {
        async initNewConnection(channelName, multiAvatar) {
            const imageStore = UseImageStore()
            const controlsStore = UseControlsStore()

            const connection = new RTCPeerConnection()

            connection.onicecandidate = async ()=> {
                let localDescription = JSON.stringify(connection.localDescription)
                console.log(localDescription)

                this.connectionsMetaData[channelName]['qrCode'] = imageStore.generateQRCode(localDescription)
            }
    
            connection.ondatachannel = async (e) => {
                const dataChannelSet = this.dataChannelMap[channelName] || new Set()
                const dataChannel = e.channel
                dataChannel.onopen = async (e) => {
                    console.log(`Data channel opened`, JSON.stringify(e));
                }
    
                dataChannel.onmessage = async (e) => {
                    let data = new TextDecoder().decode(e.data)
                    console.log(data)
                }

                dataChannelSet.add(dataChannel)
                this.dataChannelMap[channelName] = dataChannelSet
            }

            this.connectionsMap[channelName] = connection
            this.connectionsMetaData[channelName] = {
                channelName: channelName,
                qrCode: null,
                avatar: multiAvatar,
                createdAt: Date.now()
            }
            controlsStore.setSelectedChannel(channelName)
            return connection
        },
        async createOffer(channelName, rtcConnection) {
            let label = `${channelName}-${Date.now()}`
            const dataChannel = await this.createDataChan(label, rtcConnection)
            const dataChannelSet = this.dataChannelMap[channelName] || new Set()
            dataChannelSet.add(dataChannel)
            this.dataChannelMap[channelName] = dataChannelSet

            let offer = await rtcConnection.createOffer()
            console.log(`Offer Created`);
            await rtcConnection.setLocalDescription(offer)
        },
        async createDataChan(label, rtcConnection) {
            const dataChannel = await rtcConnection.createDataChannel(label)
            dataChannel.onopen = async (e) => {
                console.log(`Data channel opened`, JSON.stringify(e));
            }
    
            dataChannel.onmessage = async (e) => {
                console.log(`Received new Message`, e.data);
            }
            return dataChannel
        },
        async acceptOffer(offer) {
            offer = JSON.parse(offer)
            await this.connection.setRemoteDescription(offer)
            let answer = await this.connection.createAnswer()
            await this.connection.setLocalDescription(answer)
            this.sdp = JSON.stringify(this.connection.localDescription)
            await navigator.clipboard.writeText(this.sdp)
            console.log(`answer created`, JSON.stringify(this.connection.localDescription));
        },
        async acceptAnswer(answer) {
            answer = JSON.parse(answer)
            await this.connection.setRemoteDescription(answer)
            console.log(`remote description set.`);
            await this.readFile()
        },
        async readFile() {
            // let [fileHandler] = await window.showOpenFilePicker({
            //     mutiple: true
            // })
            // let file = await fileHandler.getFile()
            // let chunckSize = 64 * 1024 // 64kB
            //
            //
            // for (let i=0; i<=file.size; i += chunckSize) {
            //     let chunk = file.slice(i, i + chunckSize)
            //     let fileReader = new FileReader()
            //     fileReader.onload = (event) => {
            //         let buffer = event.target.result
            //         this.datachan.send(buffer)
            //         console.log(buffer)
            //     }
            //     fileReader.readAsArrayBuffer(chunk)
            // }
        }
    }
})
export default UseWebRTCStore