export type PortfolioCategory = 'INVESTMENTS' | 'CRYPTO';

export type CreatePortfolio = {
	name: string;
	description?: string;
	category?: PortfolioCategory;
};

export type UpdatePortfolio = {
	name?: string;
	description?: string;
	category?: PortfolioCategory;
};

export type PortfolioResponse = {
	id: string;
	name: string;
	category: PortfolioCategory;
	createdAt: Date;
	updatedAt: Date;
	description: string | null;
	userId: string;
};

export type PortfoliosResponse = PortfolioResponse[];
