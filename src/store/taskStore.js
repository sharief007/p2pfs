import { defineStore } from "pinia";
import UseWebRTCStore from "./webrtcStore";

const UseTaskStore = defineStore('task', {
    state: () => ({
        taskList: [],
        filesQueue: {}
    }),
    actions: {
        async createTask(filesList, channelName) {
            const webrtcStore = UseWebRTCStore()
            const dataChannel = webrtcStore.getDataChannel(channelName)

            console.log(filesList, channelName)

            for(let i=0; i<filesList.length; i++) {
                let metadata = filesList[i]
                this.taskList.push({
                    fileName: metadata.fileName,
                    fileType: metadata.fileType,
                    fileSize: metadata.fileSize,
                    status: "pending",
                    progress: 0
                })
                await this.readFile(metadata.content, dataChannel, i)
            }
        },
        async startExecutingQueue(channelName) {
            
            
        },
        readFile(file, dataChannel, index) {
            let currentTask = this.taskList[index]
            return new Promise((resolve, reject) => {
              const chunkSize = 1024 * 64; 
              let offset = 0;
              const reader = new FileReader();
          
              reader.onload = function (event) {
                if (event.target.error) {
                  reject(event.target.error);
                  return;
                }
          
                // Process the chunk of data here (e.g., append to a result string, parse, etc.)
                dataChannel.send(event.target.result)
                currentTask.progress = Math.round((offset / file.size) * 100)
          
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