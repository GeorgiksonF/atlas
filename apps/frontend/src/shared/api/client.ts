import axios, { AxiosInstance, AxiosError } from 'axios';
import { useAuthStore } from '@/features/auth/stores/authStore';

export const apiClient: AxiosInstance = axios.create({
	baseURL: '/api',
	headers: {
		'Content-Type': 'application/json',
	},
});

apiClient.interceptors.request.use((config) => {
	const authStore = useAuthStore();
	const token = authStore.token;
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

apiClient.interceptors.response.use(
	(response) => response,
	(error: AxiosError) => {
		if (error.response?.status === 401) {
			const url = error.config?.url ?? '';
			const isAuthRequest = ['/auth/login', '/auth/register'].some((path) =>
				url.endsWith(path),
			);
			if (!isAuthRequest) {
				const authStore = useAuthStore();
				authStore.logout();
				window.location.href = '/login';
			}
		}
		return Promise.reject(error);
	}
);
