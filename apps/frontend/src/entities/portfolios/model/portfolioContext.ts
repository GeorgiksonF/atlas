import type { PortfolioBroker, PortfolioCategory } from '@atlas/types';

export type PortfolioContext = {
	id: string | 'all';
	name: string;
	category: PortfolioCategory;
	broker: PortfolioBroker | null;
	description?: string;
	isSystem: boolean;
	isComposite: boolean;
};

export const ALL_PORTFOLIOS_CONTEXT: PortfolioContext = {
	id: 'all',
	name: 'Все активы',
	category: 'составной' as PortfolioCategory,
	broker: null,
	isComposite: true,
	isSystem: true,
	description: 'Общий портфель содержащий в себе все остальные счета',
};
