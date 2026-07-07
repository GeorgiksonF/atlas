import { ref } from 'vue';

import type { BrokerResponse } from '@atlas/types';

import { getErrorMessage } from '@/shared/api/errorMessage';
import { ALL_PORTFOLIOS_CONTEXT, type PortfolioContext } from '@entities/portfolios';
import { useAppToast } from '@utils';

import { defineStore } from 'pinia';

import { portfoliosRepository } from '../api/portfoliosRepository';
import { portfolioResponseToContext } from '../constants/adapters';

export const usePortfoliosStore = defineStore('portfolios', () => {
	const toast = useAppToast();
	const portfolios = ref<PortfolioContext[]>([]);
	const loading = ref(false);
	const activePortfolio = ref<PortfolioContext>(ALL_PORTFOLIOS_CONTEXT);
	const isPortfolioSidebarOpen = ref(false);

	const fetchPortfolios = async () => {
		loading.value = true;
		try {
			const response = await portfoliosRepository.getList();

			if (!response.length) {
				portfolios.value = [];
				activePortfolio.value = ALL_PORTFOLIOS_CONTEXT;
				return;
			}

			portfolios.value = response.map(portfolioResponseToContext);
		} finally {
			loading.value = false;
		}
	};

	const setActivePortfolio = (id: string | 'all') => {
		if (id === 'all') {
			activePortfolio.value = ALL_PORTFOLIOS_CONTEXT;
			return;
		}

		activePortfolio.value = portfolios.value.find((p) => p.id === id) ?? ALL_PORTFOLIOS_CONTEXT;
	};

	const togglePortfolioSidebar = (): void => {
		isPortfolioSidebarOpen.value = !isPortfolioSidebarOpen.value;
	};

	const setLoadError = (msg: string) => {
		toast.error(msg);
	};

	const deletePortfolio = async (id: string) => {
		await portfoliosRepository.delete(id);

		portfolios.value = portfolios.value.filter((p) => p.id !== id);

		if (activePortfolio.value.id === id) {
			activePortfolio.value = ALL_PORTFOLIOS_CONTEXT;
		}
	};

	const brokers = ref<BrokerResponse[]>([]);

	const isLoading = ref(false);

	const fetchBrokers = async () => {
		isLoading.value = true;
		try {
			brokers.value = await portfoliosRepository.getBrokers();
		} catch (err) {
			toast.error(getErrorMessage(err, 'Не удалось загрузить список брокеров'));
		} finally {
			isLoading.value = false;
		}
	};

	return {
		portfolios,
		loading,
		brokers,
		activePortfolio,
		isPortfolioSidebarOpen,
		fetchPortfolios,
		fetchBrokers,
		deletePortfolio,
		setActivePortfolio,
		togglePortfolioSidebar,
		setLoadError,
	};
});
