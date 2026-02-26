import type { PortfolioResponse } from '@atlas/types';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { portfoliosRepository } from '../api/portfoliosRepository';

export type ActivePortfolioId = string | 'all' | null;

export const usePortfoliosStore = defineStore('portfolios', () => {
	const portfolios = ref<PortfolioResponse[]>([]);
	const activePortfolioId = ref<ActivePortfolioId>('all');
	const isPortfolioSidebarOpen = ref(false);

	async function fetchPortfolios() {
		portfolios.value = await portfoliosRepository.getList();
	}

	function setActivePortfolio(id: ActivePortfolioId) {
		activePortfolioId.value = id;
	}

	function togglePortfolioSidebar() {
		isPortfolioSidebarOpen.value = !isPortfolioSidebarOpen.value;
	}

	function getActivePortfolio(): PortfolioResponse | null {
		if (activePortfolioId.value === 'all') return null;
		return portfolios.value.find((p) => p.id === activePortfolioId.value) ?? null;
	}

	return {
		portfolios,
		activePortfolioId,
		isPortfolioSidebarOpen,
		fetchPortfolios,
		setActivePortfolio,
		togglePortfolioSidebar,
		getActivePortfolio,
	};
});
