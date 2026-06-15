import type { PortfolioCategory, PortfolioResponse } from '@atlas/types';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useAppToast } from '@utils';
import { portfoliosRepository } from '../api/portfoliosRepository';

export type PortfolioContext = {
	id: string | 'all';
	name: string;
	category: PortfolioCategory;
	description?: string;
	isSystem: boolean;
	isComposite: boolean;
};

export const ALL_PORTFOLIOS_CONTEXT: PortfolioContext = {
	id: 'all',
	name: 'Все активы',
	category: 'составной' as PortfolioCategory,
	isComposite: true,
	isSystem: true,
	description: 'Общий портфель содержащий в себе все остальные счета',
};

const getPortfoliosContext = (portfolio: PortfolioResponse): PortfolioContext => ({
	id: portfolio.id,
	name: portfolio.name,
	category: portfolio.category,
	isComposite: false,
	isSystem: false,
	description: portfolio.description ?? undefined,
});

export const usePortfoliosStore = defineStore('portfolios', () => {
	const toast = useAppToast();
	const portfolios = ref<PortfolioContext[]>([]);
	const loading = ref(false);
	const activePortfolio = ref<PortfolioContext>(ALL_PORTFOLIOS_CONTEXT);
	const isPortfolioSidebarOpen = ref(false);

	async function fetchPortfolios() {
		loading.value = true;
		try {
			const response = await portfoliosRepository.getList();

			if (!response.length) {
				return;
			}

			portfolios.value = response.map(getPortfoliosContext);
		} finally {
			loading.value = false;
		}
	}

	function setActivePortfolio(id: string | 'all') {
		if (id === 'all') {
			activePortfolio.value = ALL_PORTFOLIOS_CONTEXT;
			return;
		}

		activePortfolio.value = portfolios.value.find((p) => p.id === id) ?? ALL_PORTFOLIOS_CONTEXT;
	}

	function togglePortfolioSidebar() {
		isPortfolioSidebarOpen.value = !isPortfolioSidebarOpen.value;
	}

	function setLoadError(msg: string) {
		toast.error(msg);
	}

	async function deletePortfolio(id: string): Promise<void> {
		await portfoliosRepository.delete(id);

		portfolios.value = portfolios.value.filter((p) => p.id !== id);

		if (activePortfolio.value.id === id) {
			activePortfolio.value = ALL_PORTFOLIOS_CONTEXT;
		}
	}

	return {
		portfolios,
		loading,
		activePortfolio,
		isPortfolioSidebarOpen,
		fetchPortfolios,
		deletePortfolio,
		setActivePortfolio,
		togglePortfolioSidebar,
		setLoadError,
	};
});
