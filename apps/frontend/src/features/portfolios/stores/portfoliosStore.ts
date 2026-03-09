import type { PortfolioResponse } from '@atlas/types';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { portfoliosRepository } from '../api/portfoliosRepository';

export type ActivePortfolioId = string | 'all' | null;

export const usePortfoliosStore = defineStore('portfolios', () => {
	const portfolios = ref<PortfolioResponse[]>([]);
	const loading = ref(false);
	const activePortfolioId = ref<ActivePortfolioId>('all');
	const isPortfolioSidebarOpen = ref(false);

	async function fetchPortfolios() {
		loading.value = true;
		try {
			portfolios.value = await portfoliosRepository.getList();
		} finally {
			loading.value = false;
		}
	}

	function setActivePortfolio(id: ActivePortfolioId) {
		activePortfolioId.value = id;
	}

	function togglePortfolioSidebar() {
		isPortfolioSidebarOpen.value = !isPortfolioSidebarOpen.value;
	}

	function closePortfolioSidebar() {
		isPortfolioSidebarOpen.value = false;
	}

	function getActivePortfolio(): PortfolioResponse | null {
		if (activePortfolioId.value === 'all') return null;
		return portfolios.value.find((p) => p.id === activePortfolioId.value) ?? null;
	}

	async function deletePortfolio(id: string): Promise<void> {
		await portfoliosRepository.delete(id);
		portfolios.value = portfolios.value.filter((p) => p.id !== id);
	}

	return {
		portfolios,
		loading,
		activePortfolioId,
		isPortfolioSidebarOpen,
		fetchPortfolios,
		deletePortfolio,
		setActivePortfolio,
		togglePortfolioSidebar,
		closePortfolioSidebar,
		getActivePortfolio,
	};
});
