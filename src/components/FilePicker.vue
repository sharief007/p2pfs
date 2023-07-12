<template>
  <v-dialog width="auto" :persistent="true" v-model:model-value="controlsStore.filePickerModal">
    <template v-slot:activator>
      <v-btn icon @click="controlsStore.showFilePickerModal"><v-icon>mdi-file-send</v-icon></v-btn>
    </template>
    <v-card :hover="true" class="d-flex flex-column h-100">
        <v-table height="600" density="compact" fixed-header class="flex-grow-1">
            <thead>
                <tr>
                  <th class="text-left">Selected</th>
                  <th class="text-left">File Name</th>
                  <th class="text-left">File Type</th>
                  <th class="text-left">File Size</th>
                </tr>
            </thead>
            <tbody class="h-100 overflow-y-auto bg-amber">
              <tr v-for="(item, i) in selectedFiles" :key="item"
                  :class="item.isSelected ? 'bg-grey-lighten-1' : ''">
                <td>
                  <v-checkbox-btn density="compact" v-model:model-value="selectedFiles[i].isSelected" :inline="true" />
                </td>
                <td> {{ item.fileName }}</td>
                <td> {{ item.fileType}}</td>
                <td> {{ item.fileSize}}</td>
              </tr>
            </tbody>
        </v-table>
      <v-card-actions>
        <v-btn variant="text" prepend-icon="mdi-upload" @click="pickFiles">choose files</v-btn>
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="controlsStore.hideFilePickerModal">close</v-btn>
        <v-btn variant="text">next</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import UseControlsStore from "../store/controlsStore";
import { ref } from "vue";
import UseImageStore from "../store/imageStore";

const controlsStore = UseControlsStore()
const imageStore = UseImageStore()

const selectedFiles = ref([])

const _fileHandler = (event) => {
  const filesList = event.target.files;
  for(let file of filesList) {
    selectedFiles.value.push({
      content: file,
      fileName: file.name,
      fileType: file.type,
      fileSize: imageStore.convertFileSize(file.size),
      isSelected: true
    })
  }
}
const pickFiles = () => {
  const fileInput = document.createElement('input');
  fileInput.type = 'file'
  fileInput.setAttribute('multiple', true)
  fileInput.style.display = 'none'
  fileInput.onchange = _fileHandler
  fileInput.click()
}
</script>

<style scoped>

</style>