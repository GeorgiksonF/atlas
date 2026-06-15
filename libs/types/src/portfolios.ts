import type { TransactionResponse } from './transactions';
import type { PortfolioBroker } from './broker'

export type PortfolioCategory = 'INVESTMENTS' | 'CRYPTO';

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
