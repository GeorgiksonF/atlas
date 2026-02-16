import { apiClient } from '@/shared/api/client';
import type { RegisterRequest, RegisterResponse } from '@atlas/types';

export const authRepository = {
	async register(data: RegisterRequest): Promise<RegisterResponse> {
		const response = await apiClient.post<RegisterResponse>('/auth/register', data);
		return response.data;
	},
};
