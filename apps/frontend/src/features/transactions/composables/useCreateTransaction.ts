import { ref } from 'vue';

import { getErrorMessage } from '@/shared/api/errorMessage';
import { useAppToast } from '@utils';

import { transactionsRepository } from '../api/transactionsRepository';
import type { AddTransactionFormValues } from '../schemas/addTransactionSchema';
import { createTransactionPayload } from '../utils/createTransactionPayload';

export function useCreateTransaction() {
	const toast = useAppToast();
	const submitError = ref('');
	const loading = ref(false);

	async function createTransaction(
		portfolioId: string,
		formValues: AddTransactionFormValues,
	): Promise<boolean> {
		submitError.value = '';
		loading.value = true;

		try {
			await transactionsRepository.create(
				portfolioId,
				createTransactionPayload(formValues),
			);
			toast.success('Сделка добавлена');
			return true;
		} catch (err: unknown) {
			submitError.value = getErrorMessage(err, 'Не удалось добавить сделку');
			return false;
		} finally {
			loading.value = false;
		}
	}

	return {
		loading,
		submitError,
		createTransaction,
	};
}
