import { ref } from 'vue';
import { useRouter } from 'vue-router';

import type { LoginRequest, RegisterRequest } from '@atlas/types';

import { getErrorMessage } from '@/shared/api/errorMessage';
import { useAppToast } from '@utils';

import { authRepository } from '../api/authRepository';
import { login as loginMessages, register as registerMessages } from '../constants/messages';
import { useAuthStore } from '../stores/authStore';

export function useAuth() {
	const router = useRouter();
	const toast = useAppToast();
	const authStore = useAuthStore();

	const submitError = ref('');
	const loading = ref(false);

	async function signIn(values: LoginRequest): Promise<boolean> {
		submitError.value = '';
		loading.value = true;

		try {
			const response = await authRepository.login(values);
			authStore.setToken(response.accessToken);
			authStore.setUser(response.user);
			toast.success(loginMessages.toastSuccessSummary);
			await router.push({ name: 'portfolio' });
			return true;
		} catch (err: unknown) {
			submitError.value = getErrorMessage(err, loginMessages.errorFallback);
			toast.error(loginMessages.toastErrorSummary);
			return false;
		} finally {
			loading.value = false;
		}
	}

	async function signUp(values: RegisterRequest): Promise<boolean> {
		submitError.value = '';
		loading.value = true;

		try {
			const response = await authRepository.register(values);
			authStore.setToken(response.accessToken);
			authStore.setUser(response.user);
			toast.success(registerMessages.toastSuccessSummary);
			await router.push({ name: 'portfolio' });
			return true;
		} catch (err: unknown) {
			submitError.value = getErrorMessage(err, registerMessages.errorFallback);
			toast.error(registerMessages.toastErrorSummary);
			return false;
		} finally {
			loading.value = false;
		}
	}

	function signOut(): void {
		authStore.logout();
		void router.push({ name: 'login' });
	}

	return {
		loading,
		submitError,
		signIn,
		signUp,
		signOut,
	};
}
