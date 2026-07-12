import { ref, watch } from 'vue';

import type { PortfolioSummaryResponse } from '@atlas/types';

import { getErrorMessage } from '@/shared/api/errorMessage';

import { portfoliosRepository } from '../api/portfoliosRepository';
import { usePortfoliosStore } from '../stores/portfoliosStore';

export function usePortfolioSummary() {
	const store = usePortfoliosStore();

	const summary = ref<PortfolioSummaryResponse | null>(null);
	const error = ref('');
	const loading = ref(false);

	async function load(): Promise<void> {
		const id = store.activePortfolio.id;
		loading.value = true;
		error.value = '';

		try {
			summary.value = await portfoliosRepository.getSummary(id);
		} catch (err: unknown) {
			summary.value = null;
			error.value = getErrorMessage(err, 'Не удалось загрузить показатели портфеля');
		} finally {
			loading.value = false;
		}
	}

	watch(() => store.activePortfolio.id, load, { immediate: true });

	return {
		summary,
		error,
		loading,
		reload: load,
	};
}
