import { computed } from 'vue';

import { usePortfoliosStore } from '../stores/portfoliosStore';

export function useActivePortfolioId() {
	const store = usePortfoliosStore();

	const currentPortfolioId = computed(() => {
		const id = store.activePortfolio.id;
		if (id && id !== 'all') return id;
		return null;
	});

	return {
		currentPortfolioId,
	};
}
