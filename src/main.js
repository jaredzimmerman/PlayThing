import Vue from 'vue'
import App from './App.vue'
import Vue2TouchEvents from 'vue2-touch-events'

import '@/styles/global/reset.scss'
import '@/styles/global/app.scss'

Vue.config.productionTip = false

Vue.use(Vue2TouchEvents, {
  disableClick: false
})

new Vue({
  render: h => h(App)
}).$mount('#app')
