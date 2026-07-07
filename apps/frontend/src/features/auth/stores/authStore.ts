import { computed, ref } from 'vue';

import type { User } from '@atlas/types';

import { clearAuthToken, getAuthToken, setAuthToken } from '@/shared/api/authSession';

import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', () => {
	const token = ref<string | null>(getAuthToken());
	const user = ref<User | null>(null);

	const isAuthenticated = computed(() => !!token.value);

	const setToken = (newToken: string) => {
		setAuthToken(newToken);
		token.value = newToken;
	};

	const setUser = (newUser: User) => {
		user.value = newUser;
	};

	const logout = () => {
		clearAuthToken();
		user.value = null;
		token.value = null;
	};

	return {
		token,
		user,
		isAuthenticated,
		setToken,
		setUser,
		logout,
	};
});
