import { CreatePortfolio, PortfolioResponse, UpdatePortfolio } from '@atlas/types';
import { PortfolioForm } from '../components/schemas/portfolioFormSchemas';
import { PortfolioContext } from '../stores/portfoliosStore';

export const portoflioFormToCreate = (form: PortfolioForm): CreatePortfolio => ({
	name: form.name,
	description: undefined,
	category: form.category ?? undefined,
	broker: form.broker ?? undefined,
});

export const portoflioFormToUpdate = (form: PortfolioForm): UpdatePortfolio => ({
	name: form.name ?? undefined,
	description: undefined,
	category: form.category ?? undefined,
	broker: form.broker ?? undefined,
});

export const portfolioResponseToContext = (portfolio: PortfolioResponse): PortfolioContext => ({
	id: portfolio.id,
	name: portfolio.name,
	category: portfolio.category,
	broker: portfolio.broker,
	isComposite: false,
	isSystem: false,
	description: portfolio.description ?? undefined,
});
