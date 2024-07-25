import './assets/main.css'
import '@/styles/global/reset.scss'
import '@/styles/global/app.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'

import Vue3TouchEvents, { type Vue3TouchEventsOptions } from 'vue3-touch-events'

const app = createApp(App)

app.use(router)

app.use<Vue3TouchEventsOptions>(Vue3TouchEvents, {
  disableClick: false
  // any other global options...
})

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)

app.mount('#app')
