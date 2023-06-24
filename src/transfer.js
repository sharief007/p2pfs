function sendFileViaPeerJS(file) {
  const peer = new Peer()

  peer.on('open', (peerId) => {
    console.log(`Connected with peer ID: ${peerId}`)

    const chunkSize = 1024 * 1024 // 1MB chunk size (adjust as needed)

    const readChunks = async (file) => {
      const chunks = []
      let offset = 0

      while (offset < file.size) {
        const chunk = file.slice(offset, offset + chunkSize)
        const arrayBuffer = await new Promise((resolve) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result)
          reader.readAsArrayBuffer(chunk)
        })
        chunks.push(arrayBuffer)
        offset += chunkSize
      }

      return chunks
    }

    readChunks(file)
      .then((chunks) => {
        const mediaStream = new MediaStream()
        const videoTrack = mediaStream.addTrack(new MediaStreamTrack())
        const sender = peer.call('remote-peer-id', mediaStream) // Replace 'remote-peer-id' with the actual ID of the remote peer

        sender.on('stream', (stream) => {
          console.log('Remote peer stream received:', stream)
        })

        const sendChunk = () => {
          if (chunks.length > 0) {
            const chunk = chunks.shift()
            videoTrack.write(chunk)
          }
        }

        videoTrack.onended = () => {
          console.log('File transmission completed')
          peer.destroy()
        }

        videoTrack.addEventListener('needdata', sendChunk)
        videoTrack.addEventListener('error', (error) => {
          console.error('Error sending file chunk:', error)
        })

        sendChunk()

        // Stop sending chunks after 5 seconds (adjust as needed)
        setTimeout(() => {
          videoTrack.stop()
        }, 5000)
      })
      .catch((error) => {
        console.error('Error reading file chunks:', error)
      })
  })
}
