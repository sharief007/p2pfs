import { defineStore } from 'pinia'
import {fi} from "vuetify/locale";

const usertcStore = defineStore('webrtc', {
    state: () => ({
        configuration: {
            configuration: {
                offerToReceiveAudio: true,
                offerToReceiveVideo: true
            },
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        },
        connection : null,
        datachan : null,
        sdp: 'hello world'
    }),
    actions: {
        async createOffer() {
            await this.createDataChan('data-channel-01')
            let offer = await this.connection.createOffer()
            console.log(`Offer Created`);
            await this.connection.setLocalDescription(offer)
            this.sdp = JSON.stringify(this.connection.localDescription)
            await navigator.clipboard.writeText(this.sdp)
        },
        async acceptAnswer(answer) {
            answer = JSON.parse(answer)
            await this.connection.setRemoteDescription(answer)
            console.log(`remote description set.`);
            await this.readFile()
        },
        async init() {
            this.connection = new RTCPeerConnection()

            this.connection.onicecandidate = async ()=> {
                this.sdp = JSON.stringify(this.connection.localDescription)
                console.log(`New Ice Candidate`, this.sdp);
                await navigator.clipboard.writeText(this.sdp)
            }
    
            this.connection.ondatachannel = async (e) => {
                this.datachan = e.channel
                this.datachan.onopen = async (e) => {
                    console.log(`Data channel opened`, JSON.stringify(e));
                }
    
                this.datachan.onmessage = async (e) => {
                    let data = new TextDecoder().decode(e.data)
                    console.log(data)
                }
            }
        },
        async createDataChan(label) {
            this.datachan = await this.connection.createDataChannel(label)
            this.datachan.onopen = async (e) => {
                console.log(`Data channel opened`, JSON.stringify(e));
            }
    
            this.datachan.onmessage = async (e) => {
                console.log(`Received new Message`, e.data);
            }
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
        async readFile() {
            let [fileHandler] = await window.showOpenFilePicker({
                mutiple: true
            })
            let file = await fileHandler.getFile()
            let chunckSize = 64 * 1024 // 64kB


            for (let i=0; i<=file.size; i += chunckSize) {
                let chunk = file.slice(i, i + chunckSize)
                let fileReader = new FileReader()
                fileReader.onload = (event) => {
                    let buffer = event.target.result
                    this.datachan.send(buffer)
                    console.log(buffer)
                }
                fileReader.readAsArrayBuffer(chunk)
            }
        }
    }
})
export default usertcStore