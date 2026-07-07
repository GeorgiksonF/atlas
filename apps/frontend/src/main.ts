import './style.css';

import { createApp } from 'vue';

import { preset } from '@/config/theme';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { setUnauthorizedHandler } from '@/shared/api/authSession';

import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';

import App from './App.vue';
import router from './router';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
setUnauthorizedHandler(() => {
	const authStore = useAuthStore();
	authStore.logout();

	if (router.currentRoute.value.name !== 'login') {
		void router.push({ name: 'login' });
	}
});

app.use(router);
app.use(ToastService);
app.use(ConfirmationService);
app.use(PrimeVue, {
	theme: {
		preset,
	},
});

app.mount('#app');
