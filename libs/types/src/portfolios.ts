export type PortfolioCategory = 'INVESTMENTS' | 'CRYPTO';

export type CreatePortfolio = {
	name: string;
	description?: string;
	category?: PortfolioCategory;
	broker?: string;
};

export type UpdatePortfolio = {
	name?: string;
	description?: string;
	category?: PortfolioCategory;
	broker?: string;
};

export type PortfolioResponse = {
	id: string;
	name: string;
	category: PortfolioCategory;
	broker: string | null;
	createdAt: Date;
	updatedAt: Date;
	description: string | null;
	userId: string;
};

export type PortfoliosResponse = PortfolioResponse[];
