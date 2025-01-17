import { createApp } from "vue";
import { createPinia } from 'pinia'
import Icons from '@/components/icons.vue'
import App from "./App.vue";
import './assets/icons.js'


const pinia = createPinia()
const app = createApp(App)
app.use(pinia)
app.component('svg-icon', Icons)
app.mount("#app")