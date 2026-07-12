import type { TransactionResponse } from './transactions';
import type { PortfolioBroker } from './broker'

export const PORTFOLIO_CATEGORIES = ['INVESTMENTS', 'CRYPTO'] as const;
export type PortfolioCategory = (typeof PORTFOLIO_CATEGORIES)[number];

export type CreatePortfolio = {
	name: string;
	description?: string;
	category?: PortfolioCategory;
	broker?: PortfolioBroker;
};

export type UpdatePortfolio = {
	name?: string;
	description?: string;
	category?: PortfolioCategory;
	broker?: PortfolioBroker;
};

export type PortfolioResponse = {
	id: string;
	name: string;
	category: PortfolioCategory;
	broker: PortfolioBroker | null;
	createdAt: Date;
	updatedAt: Date;
	description: string | null;
	userId: string;
};

export type PortfoliosResponse = PortfolioResponse[];

export type PortfolioWithTransactionsResponse = PortfolioResponse & {
	transactions: TransactionResponse[]
}
