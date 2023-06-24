import { createApp } from 'vue'

import App from './App.vue'
import router from './router'

// Vuetify
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import { createPinia } from 'pinia'
// import useControlsStore from './store/ui-controls'

const app = createApp(App)
const pinia = createPinia()
const vuetify = createVuetify({
  components,
  directives
})

// pinia.use(useControlsStore)

app.use(pinia)
app.use(vuetify)
app.use(router)

app.mount('#app')
