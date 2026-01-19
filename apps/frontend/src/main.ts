import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router';
import PrimeVue from 'primevue/config';
import { preset } from '@/config/theme';

const app = createApp(App);

app.use(router);
app.use(PrimeVue, {
	theme: {
		preset,
	},
});

app.mount('#app');
