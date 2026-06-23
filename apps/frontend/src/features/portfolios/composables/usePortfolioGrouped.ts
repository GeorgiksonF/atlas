import { computed, ref } from 'vue';

import type { PortfolioCategory } from '@atlas/types';

import { PORTFOLIO_CATEGORY_LABELS } from '../constants/constants.ts';
import { type PortfolioContext, usePortfoliosStore } from '../stores/portfoliosStore';

export interface Category {
	key: PortfolioCategory;
	icon: string;
	title: string;
	badge: number;
	portfolioValue: string;
	portfolios: PortfolioContext[];
}
const categoryIcons: Record<PortfolioCategory, string> = {
	INVESTMENTS: 'pi pi-briefcase',
	CRYPTO: 'pi pi-bitcoin',
};

const portfolioCategories = Object.keys(PORTFOLIO_CATEGORY_LABELS) as PortfolioCategory[];

export const usePortfolioGrouped = () => {
	const store = usePortfoliosStore();
	const searchQuery = ref('');

	const expandedByCategory = ref<Record<PortfolioCategory, boolean>>({
		INVESTMENTS: true,
		CRYPTO: true,
	});

	const portfoliosByCategory = computed(() => {
		const map: Record<PortfolioCategory, PortfolioContext[]> = {
			INVESTMENTS: [],
			CRYPTO: [],
		};

		for (const p of filteredPortfolios.value) {
			map[p.category].push(p);
		}

		return map;
	});

	const filteredPortfolios = computed(() => {
		const q = searchQuery.value.trim().toLowerCase();

		if (!q) return store.portfolios;

		return store.portfolios.filter((p) => p.name.toLowerCase().includes(q));
	});

	const visibleCategories = computed<Category[]>(() =>
		portfolioCategories
			.filter((c) => portfoliosByCategory.value[c]?.length > 0)
			.map((c) => ({
				key: c,
				icon: categoryIcons[c],
				badge: portfoliosByCategory.value[c]?.length ?? 0,
				title: PORTFOLIO_CATEGORY_LABELS[c],
				portfolioValue: '',
				portfolios: portfoliosByCategory.value[c],
			})),
	);

	return {
		loading: store.loading,
		portfoliosByCategory,
		visibleCategories,
		expandedByCategory,
		searchQuery,
	};
};
