import axios, { AxiosError, AxiosInstance } from 'axios';

import { getAuthToken, handleUnauthorized } from './authSession';

export const apiClient: AxiosInstance = axios.create({
	baseURL: '/api',
	headers: {
		'Content-Type': 'application/json',
	},
});

apiClient.interceptors.request.use((config) => {
	const token = getAuthToken();
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
				handleUnauthorized();
			}
		}
		return Promise.reject(error);
	}
);
