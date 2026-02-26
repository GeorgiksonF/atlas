import type { CreatePortfolio, UpdatePortfolio } from '@atlas/types';
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

const PORTFOLIO_CATEGORIES = ['INVESTMENTS', 'CRYPTO'] as const;

export class CreatePortfolioDto implements CreatePortfolio {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsString()
	@IsOptional()
	description?: string;

	@IsString()
	@IsOptional()
	@IsIn(PORTFOLIO_CATEGORIES)
	category?: CreatePortfolio['category'];
}

export class UpdatePortfolioDto implements UpdatePortfolio {
	@IsString()
	@IsOptional()
	@IsNotEmpty()
	name?: string;

	@IsString()
	@IsOptional()
	description?: string;

	@IsString()
	@IsOptional()
	@IsIn(PORTFOLIO_CATEGORIES)
	category?: UpdatePortfolio['category'];
}
