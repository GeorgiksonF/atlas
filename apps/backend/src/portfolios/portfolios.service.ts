import { Injectable } from '@nestjs/common';

import { PrismaClient } from '@atlas/database';
import type {
	BrokerResponse,
	CreatePortfolio,
	PortfolioResponse,
	PortfoliosResponse,
	UpdatePortfolio,
} from '@atlas/types';

import { PortfolioAccessService } from './access/portfolio-access.service';
import { isPortfolioBroker, PORTFOLIO_BROKERS } from './constants/broker';
import { portfolioToResponse } from './utils/adapters';

@Injectable()
export class PortfoliosService {
	constructor(
		private readonly prisma: PrismaClient,
		private readonly portfolioAccessService: PortfolioAccessService,
	) {}

	getBrokers(): BrokerResponse[] {
		return Object.keys(PORTFOLIO_BROKERS)
			.filter(isPortfolioBroker)
			.map((value) => ({
				value,
				label: PORTFOLIO_BROKERS[value],
			}));
	}

	async findAllByUserId(userId: string): Promise<PortfoliosResponse> {
		const portfolio = await this.prisma.portfolio.findMany({
			where: { userId },
			orderBy: { createdAt: 'asc' },
		});

		return portfolio.map(portfolioToResponse);
	}

	async findById(id: string, userId: string): Promise<PortfolioResponse> {
		const portfolio = await this.portfolioAccessService.assertOwned(
			id,
			userId,
		);

		return portfolioToResponse(portfolio);
	}

	async create(
		userId: string,
		dto: CreatePortfolio,
	): Promise<PortfolioResponse> {
		const portfolio = await this.prisma.portfolio.create({
			data: {
				userId,
				...dto,
			},
		});

		return portfolioToResponse(portfolio);
	}

	async update(
		id: string,
		userId: string,
		dto: UpdatePortfolio,
	): Promise<PortfolioResponse> {
		await this.portfolioAccessService.assertOwned(id, userId);

		const portfolioUpdated = await this.prisma.portfolio.update({
			where: { id },
			data: dto,
		});

		return portfolioToResponse(portfolioUpdated);
	}

	async delete(id: string, userId: string) {
		await this.portfolioAccessService.assertOwned(id, userId);

		await this.prisma.portfolio.delete({ where: { id } });
	}
}
