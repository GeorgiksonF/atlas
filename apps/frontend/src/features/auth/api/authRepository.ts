import type { AuthResponse, LoginRequest, RegisterRequest } from '@atlas/types';

import { apiClient } from '@/shared/api/client';

export const authRepository = {
	async register(data: RegisterRequest): Promise<AuthResponse> {
		const response = await apiClient.post<AuthResponse>('/auth/register', data);
		return response.data;
	},
	async login(data: LoginRequest): Promise<AuthResponse> {
		const response = await apiClient.post<AuthResponse>('/auth/login', data);
		return response.data;
	},
};
