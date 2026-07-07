import { ref } from 'vue';

import type { BrokerResponse } from '@atlas/types';

import { ALL_PORTFOLIOS_CONTEXT, type PortfolioContext } from '@entities/portfolios';

import { defineStore } from 'pinia';

import { portfoliosRepository } from '../api/portfoliosRepository';
import { portfolioResponseToContext } from '../constants/adapters';

export const usePortfoliosStore = defineStore('portfolios', () => {
	const portfolios = ref<PortfolioContext[]>([]);
	const loading = ref(false);
	const activePortfolio = ref<PortfolioContext>(ALL_PORTFOLIOS_CONTEXT);

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
		} finally {
			isLoading.value = false;
		}
	};

	return {
		portfolios,
		loading,
		brokers,
		activePortfolio,
		fetchPortfolios,
		fetchBrokers,
		deletePortfolio,
		setActivePortfolio,
	};
});
