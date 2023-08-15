<template>
  <v-card>
    <v-progress-linear
      height="65"
      color="grey-lighten-3"
      :model-value="props.value.progress"
      :striped="props.controls"
    >
      <v-card-item style="width: 100%">
        <v-card-title>{{ props.value.fileName }}</v-card-title>
        <v-card-subtitle class="d-flex flex-no-wrap justify-space-between">
          <span>{{ props.value.fileType }}</span>
          <span>{{ props.value.fileSize }}</span>
        </v-card-subtitle>
      </v-card-item>
    </v-progress-linear>
    <v-divider></v-divider>
    <v-list-item density="compact" width="100%">
      <template v-slot:prepend>
        <span>
          {{ taskStatus }}
        </span>
      </template>
      <template v-slot:append v-if="props.controls">
        <v-btn variant="text" :flat="true" size="small" @click="toggleExecution" prepend-icon="mdi-play" :disabled="props.value.status === TaskStatus.PENDING"
          >{{ toggleButtonText }}</v-btn
        >
        <v-btn variant="text" :flat="true" size="small" prepend-icon="mdi-trash-can">delete</v-btn>
      </template>
    </v-list-item>
  </v-card>
</template>

<script setup>
import { computed } from 'vue';
import { TaskStatus } from '../models/models';
import UseTaskStore from '../store/taskStore';

const props = defineProps(['value', 'controls'])

const taskStatus = computed(() => {
  switch (props.value.status) {
    case TaskStatus.PENDING:
      return `⌛ Pending`
    case TaskStatus.CANCELLED:
      return  `❎ Cancelled`
    case TaskStatus.COMPLETED:
      return `✅ Completed`
    case TaskStatus.FAILED:
      return `❌ Failed`
    case TaskStatus.REJECTED:
      return `❌ Rejected`
    default:
      return `${props.value.progress}% Completed`
  }
})

const toggleExecution = () => {
  const taskStore = UseTaskStore()
  const fileSenderId = props.value.fileSenderId
  taskStore.toggleTaskExecution(fileSenderId)
}

const toggleButtonText = computed(()=> {
  if (props.value.status === TaskStatus.ACTIVE) {
    return "pause"
  } else {
    return "resume"
  }
})

</script>
