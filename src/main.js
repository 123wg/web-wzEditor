import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import bus from '@/common/EventBus';
import App from './App.vue';
import store from './store';
import router from './router';
import 'element-plus/dist/index.css';

const app = createApp(App);
app.use(store);
app.use(router);
app.use(ElementPlus);
app.config.globalProperties.$bus = bus;
app.mount('#app');
