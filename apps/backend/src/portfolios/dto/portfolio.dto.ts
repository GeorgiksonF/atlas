import type {
	CreatePortfolio,
	PortfolioBroker,
	UpdatePortfolio,
} from '@atlas/types';

import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { PORTFOLIO_BROKERS } from '../constants/broker';

const PORTFOLIO_CATEGORIES = ['INVESTMENTS', 'CRYPTO'] as const;
const BROKER_KEYS = Object.keys(PORTFOLIO_BROKERS) as PortfolioBroker[];

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
	@IsIn(BROKER_KEYS)
	broker?: PortfolioBroker;
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
	@IsIn(BROKER_KEYS)
	broker?: PortfolioBroker;
}
