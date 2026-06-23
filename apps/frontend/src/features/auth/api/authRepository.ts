import type {
	LoginRequest,
	RegisterRequest,
	RegisterResponse,
} from '@atlas/types';

import { apiClient } from '@/shared/api/client';

export interface LoginResponse {
	access_token: string;
	user: { id: string; email: string; name: string };
}

export const authRepository = {
	async register(data: RegisterRequest): Promise<RegisterResponse> {
		const response = await apiClient.post<RegisterResponse>('/auth/register', data);
		return response.data;
	},
	async login(data: LoginRequest): Promise<LoginResponse> {
		const response = await apiClient.post<LoginResponse>('/auth/login', data);
		return response.data;
	},
};
