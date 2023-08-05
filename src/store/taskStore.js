import { defineStore } from 'pinia'
import UseWebRTCStore from './webrtcStore'

const UseTaskStore = defineStore('task', {
  state: () => ({
    taskList: [],
    senderMap: {},
    receiverMap: {},
    receiverTask: {}
  }),
  actions: {
    createTask(filesList, channelName) {
      const webrtcStore = UseWebRTCStore()
      const dataChannel = webrtcStore.getDataChannel(channelName)

      console.log(filesList, channelName)

      for (let i = 0; i < filesList.length; i++) {
        let item = filesList[i]

        this.senderMap[item.senderId] = item.content
        this.taskList.push({
          fileSenderId: item.senderId,
          fileName: item.content.name,
          fileType: item.content.type,
          rawSize: item.content.size,
          fileSize: item.fileSize,
          status: 'pending',
          progress: 0,
          offset: 0
        })

        try {
          dataChannel.send(
            JSON.stringify({
              type: 'FILE_REQUEST',
              fileSenderId: item.senderId,
              fileName: item.content.name,
              fileType: item.content.type,
              fileSize: item.fileSize,
              rawSize: item.content.size
            })
          )
        } catch (e) {
          console.log('sending a file request failed', e)
        }
      }
    },
    acceptTask(metadata) {
      const webrtcStore = UseWebRTCStore()
      const dataChannel = webrtcStore.getDataChannel(metadata.channelName)

      const currentTask = {
        fileReceiverId: metadata.receiverId,
        fileSenderId: metadata.senderId,
        fileName: metadata.fileName,
        fileType: metadata.fileType,
        fileSize: metadata.fileSize,
        rawSize: metadata.rawSize,
        status: 'running',
        progress: 0,
        offset: 0
      }

      this.taskList.push(currentTask)
      this.receiverTask[metadata.receiverId] = currentTask
      this.receiverMap[metadata.receiverId] = []

      try {
        dataChannel.send(
          JSON.stringify({
            type: 'FILE_RESPONSE',
            fileSenderId: metadata.senderId,
            fileReceiverId: metadata.receiverId
          })
        )
      } catch (e) {
        console.log('sending accept response failed', e)
      }
    },
    processResponse(channelName, message) {
      const webrtcStore = UseWebRTCStore()
      const dataChannel = webrtcStore.getDataChannel(channelName)

      let index = this.taskList.findIndex((task) => task.fileSenderId === message.fileSenderId)
      const currentTask = this.taskList[index]
      if (message.fileReceiverId) {
        currentTask.fileReceiverId = message.fileReceiverId

        let file = this.senderMap[message.fileSenderId]
        this.readFile(file, dataChannel, currentTask).then(() => {
          console.log('File sending completed')
          currentTask.status = 'completed'
        })
      } else {
        currentTask.status = 'cancelled'
      }
    },
    readFile(file, dataChannel, currentTask) {
      return new Promise((resolve, reject) => {
        const chunkSize = 1024

        const { fileSenderId, fileReceiverId } = currentTask
        const reader = new FileReader()

        reader.onload = function (event) {
          if (event.target.error) {
            reject(event.target.error)
            return
          }

          // Process the chunk of data here (e.g., append to a result string, parse, etc.)
          let payload = JSON.stringify({
            // fileSenderId,
            fileReceiverId,
            content: Array.from(new Uint8Array(event.target.result))
          })
          dataChannel.send(payload)
          currentTask.offset += event.target.result.byteLength
          currentTask.progress = Math.round((currentTask.offset / file.size) * 100)

          if (currentTask.offset < file.size) {
            readNextChunk()
          } else {
            resolve()
          }
        }

        reader.onerror = function () {
          reject(new Error('Error occurred while reading the file.'))
        }

        function readNextChunk() {
          const blob = file.slice(currentTask.offset, currentTask.offset + chunkSize)
          reader.readAsArrayBuffer(blob) // You can use 'readAsArrayBuffer' for binary files
        }

        readNextChunk()
      })
    },
    processData(channelName, message) {
      const { fileReceiverId } = message
      if (fileReceiverId) {
        const currentTask = this.receiverTask[fileReceiverId]
        const buffer = new Uint8Array(message.content).buffer

        this.receiverMap[fileReceiverId].push(buffer)
        currentTask.offset += buffer.byteLength
        currentTask.progress = Math.round((currentTask.offset / currentTask.rawSize) * 100)

        if (currentTask.offset === currentTask.rawSize) {
          currentTask.status = 'completed'

          const file = new Blob(this.receiverMap[fileReceiverId], {
            type: currentTask.fileType || 'application/octet-stream'
          })
          const anchor = document.createElement('a')
          anchor.href = URL.createObjectURL(file)
          ;(anchor.download = currentTask.fileName), (anchor.style.display = 'none')
          anchor.click()
          setTimeout(URL.revokeObjectURL, 10000, anchor.href)
        }
      }
    }
  }
})

export default UseTaskStore
