import { Peer } from 'peerjs'

class P2PNetwork {
  constructor() {
    this.peer = new Peer()

    this.peer.on('open', (id) => {
      console.log(id)
      this.peerId = id
    })

    this.connectionMap = new Map()

    this.peer.on('connection', (conn) => {
      this.connectionMap.set(conn.peer, conn)

      conn.on('data', (data) => {
        console.log(`received data from ${conn.peer}`)
        console.log(data)
      })
    })
  }

  connectTo(remotePeerId) {
    let newConnection = this.peer.connect(remotePeerId)
    this.connectionMap.set(remotePeerId, newConnection)

    newConnection.on('open', () => {
      console.log(`Connection established ${newConnection.peer}`)
    })
    newConnection.on('data', (data) => {
      console.log(`Received this data from ${newConnection.peer}`)
      console.log(data)
    })
  }

  sendData(remotePeerId, message) {
    if (this.connectionMap.has(remotePeerId)) {
      let conn = this.connectionMap.get(remotePeerId)
      conn.send(message)
      console.log('sent')
    }
  }
}

const network = new P2PNetwork()

export default network
