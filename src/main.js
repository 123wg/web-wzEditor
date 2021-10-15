import { createApp } from 'vue';
import bus from '@/common/EventBus';
import App from './App.vue';
import store from './store';
import router from './router';

const app = createApp(App);
app.use(store);
app.use(router);
app.config.globalProperties.$bus = bus;
app.mount('#app');
