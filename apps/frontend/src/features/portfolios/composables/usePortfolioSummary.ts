import type { PortfolioSummaryResponse } from '@atlas/types';
import { ref, watch } from 'vue';
import { portfoliosRepository } from '../api/portfoliosRepository';
import { usePortfoliosStore } from '../stores/portfoliosStore';

export function usePortfolioSummary() {
	const store = usePortfoliosStore();

	const summary = ref<PortfolioSummaryResponse | null>(null);
	const loading = ref(false);

	async function load(): Promise<void> {
		const id = store.activePortfolio.id;
		loading.value = true;

		try {
			summary.value = await portfoliosRepository.getSummary(id);
		} catch (err: unknown) {
			summary.value = null;
		} finally {
			loading.value = false;
		}
	}

	watch(() => store.activePortfolio.id, load, { immediate: true });

	return {
		summary,
		loading,
		reload: load,
	};
}
