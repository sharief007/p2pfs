import { defineStore } from "pinia";
import UseWebRTCStore from "./webrtcStore";

const UseTaskStore = defineStore('task', {
    state: () => ({
        taskList: [],
        senderMap: {},
        receiverMap: {}
    }),
    actions: {
        async createTask(filesList, channelName) {
            const webrtcStore = UseWebRTCStore()
            const dataChannel = webrtcStore.getDataChannel(channelName)

            console.log(filesList, channelName)

            for(let i=0; i<filesList.length; i++) {
                let item = filesList[i]
                this.taskList.push({
                    fileSenderId: item.senderId,
                    fileName: item.content.name,
                    fileType: item.content.type,
                    fileSize: item.fileSize,
                    status: "pending",
                    progress: 0
                })

                this.senderMap[item.senderId] = item.content

                dataChannel.send(JSON.stringify({
                  type: "FILE_REQUEST",
                  fileSenderId: item.senderId,
                  fileName: item.content.name,
                  fileType: item.content.type,
                  fileSize: item.fileSize
                }))
            }
        },
        async acceptTask(metadata) {
          const webrtcStore = UseWebRTCStore()
          const dataChannel = webrtcStore.getDataChannel(metadata.channelName)
            
          this.taskList.push({
            fileReceiverId: metadata.receiverId,
            fileSenderId: metadata.senderId,
            fileName: metadata.fileName,
            fileType: metadata.fileType,
            fileSize: metadata.fileSize,
            status: "running",
            progress: 0
          })

          dataChannel.send(JSON.stringify({
            type: "FILE_RESPONSE",
            fileSenderId: metadata.senderId,
            fileReceiverId: metadata.receiverId
          }))
        },
        async processResponse(channelName, message) {
          const webrtcStore = UseWebRTCStore()
          const dataChannel = webrtcStore.getDataChannel(channelName)

          let index = this.taskList.findIndex(task => task.fileSenderId == message.fileSenderId)
          if(message.fileReceiverId) {
            const currentTask = this.taskList[index]
            currentTask.fileReceiverId = message.fileReceiverId

            let file = this.senderMap[message.fileSenderId]
            this.readFile(file, dataChannel, currentTask, message.fileSenderId, message.fileReceiverId)
          } else {

          }
        },
        readFile(file, dataChannel, currentTask, fileSenderId, fileReceiverId) {
            return new Promise((resolve, reject) => {
              const chunkSize = 1024; 
              let offset = 0;
              const reader = new FileReader();
          
              reader.onload = function (event) {
                if (event.target.error) {
                  reject(event.target.error);
                  return;
                }
          
                // Process the chunk of data here (e.g., append to a result string, parse, etc.)
                currentTask.progress = Math.round((offset / file.size) * 100)
                dataChannel.send(JSON.stringify({
                  fileSenderId,
                  fileReceiverId,
                  content: event.target.result
                }))
          
                offset += event.target.result.byteLength;
                if (offset < file.size) {
                  readNextChunk();
                } else {
                  resolve();
                }
              };
          
              reader.onerror = function () {
                reject(new Error('Error occurred while reading the file.'));
              };
          
              function readNextChunk() {
                const blob = file.slice(offset, offset + chunkSize);
                reader.readAsArrayBuffer(blob); // You can use 'readAsArrayBuffer' for binary files
              }
          
              readNextChunk();
            });
          }
    }
})

export default UseTaskStore