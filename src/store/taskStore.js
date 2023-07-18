import { defineStore } from "pinia";

const UseTaskStore = defineStore('task', {
    state: () => ({
        taskList : [{
            file: null,
            name: "image.png",
            type: "image/png",
            
        }]
    }),
    actions: {
        createTask({
            file, name, type, size
        }) {
            this.taskList.push({
                file, name, type, name, size,
                status: "running",
                progress: 0,
            })
        }
    }
})

export default UseTaskStore