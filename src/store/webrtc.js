import { defineStore } from 'pinia'

const usertcStore = defineStore('webrtc', {
    state: () => ({
        connection : null,
        datachan : null,
        sdp: 'hello world'
    }),
    actions: {
        async createOffer() {   
            let offer = await this.connection.createOffer()
            console.log(`Offer Created`);
            await this.connection.setLocalDescription(offer)
            this.sdp = JSON.stringify(this.connection.localDescription)
            
            this.createDataChan('data-channel-01')
        },
        async acceptAnswer(answer) {
            answer = JSON.parse(answer)
            await this.connection.setRemoteDescription(answer)
            console.log(`remote description set.`);
        },
        init() {
            this.connection = new RTCPeerConnection({
                configuration: {
                  offerToReceiveAudio: true,
                  offerToReceiveVideo: true
                },
                iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
              })
            this.connection.onicecandidate = async (e)=> {
                this.sdp = JSON.stringify(this.connection.localDescription)
                console.log(`New Ice Candidate`, this.sdp);
            }
    
            this.connection.ondatachannel = async (e) => {
                this.datachan = e.channel
                this.datachan.onopen = async (e) => {
                    console.log(`Data channel opened`, JSON.stringify(e));
                }
    
                this.datachan.onmessage = async (e) => {
                    console.log(`Received new Message`, JSON.stringify(e));
                }
            }
        },
        async createDataChan(label) {
            this.datachan = await this.connection.createDataChannel(label)
            this.datachan.onopen = async (e) => {
                console.log(`Data channel opened`, JSON.stringify(e));
            }
    
            this.datachan.onmessage = async (e) => {
                console.log(`Received new Message`, JSON.stringify(e));
            }
        },
        async acceptOffer(offer) {
            offer = JSON.parse(offer)
            await this.connection.setRemoteDescription(offer)
            let answer = await this.connection.createAnswer()
            await this.connection.setLocalDescription(answer)
            this.sdp = JSON.stringify(this.connection.localDescription)
            console.log(`answer created`, JSON.stringify(this.connection.localDescription));
        }
    }
})
export default usertcStore