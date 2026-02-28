import type { CreatePortfolio, UpdatePortfolio } from '@atlas/types';
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PORTFOLIO_BROKERS } from '../constants/brokers';

const PORTFOLIO_CATEGORIES = ['INVESTMENTS', 'CRYPTO'] as const;
const BROKER_VALUES = PORTFOLIO_BROKERS as unknown as string[];

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

	@IsString()
	@IsOptional()
	@IsIn(BROKER_VALUES)
	broker?: string;
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

	@IsString()
	@IsOptional()
	@IsIn(BROKER_VALUES)
	broker?: string;
}
