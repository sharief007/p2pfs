import { createApp } from 'vue'

import App from './App.vue'
import router from './router'

// Vuetify
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { initializeApp } from 'firebase/app'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import { createPinia } from 'pinia'

const app = createApp(App)
const pinia = createPinia()

const vuetify = createVuetify({
  components,
  directives
})

const firebaseConfig = {
  apiKey: 'AIzaSyBNIySIwe75Rbq0WCnaj5PzcgT1x5yVvjc',
  authDomain: 'p2p-fs.firebaseapp.com',
  projectId: 'p2p-fs',
  storageBucket: 'p2p-fs.appspot.com',
  messagingSenderId: '1060143440529',
  appId: '1:1060143440529:web:82c9a25dfe12c7b0129530'
}

// Initialize Firebase
initializeApp(firebaseConfig)
app.use(pinia)
app.use(vuetify)
app.use(router)

app.mount('#app')
