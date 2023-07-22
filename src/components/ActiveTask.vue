<template>
  <v-card>
    <v-progress-linear
      height="65"
      color="grey-lighten-3"
      :model-value="props.value.progress"
      :striped="true"
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
          {{ `${props.value.progress}% completed` }}
        </span>
      </template>
      <template v-slot:append>
        <v-btn
          variant="text"
          :flat="true"
          size="small"
          @click="print"
          prepend-icon="mdi-play"
          >play</v-btn
        >
        <v-btn variant="text" :flat="true" size="small" prepend-icon="mdi-trash-can">delete</v-btn>
      </template>
    </v-list-item>
  </v-card>
</template>

<script setup>
const props = defineProps(["value"])
const print = () => {
  console.log(props.value)
}
</script>
