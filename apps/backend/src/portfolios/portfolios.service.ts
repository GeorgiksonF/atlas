import {
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';

import { PrismaClient } from '@atlas/database';
import type {
	BrokerResponse,
	CreatePortfolio,
	PortfolioResponse,
	PortfoliosResponse,
	UpdatePortfolio,
} from '@atlas/types';

import { isPortfolioBroker, PORTFOLIO_BROKERS } from './constants/broker';
import { PORTFOLIO_ERROR_MESSAGES } from './constants/messages';
import { portfolioToResponse } from './utils/adapters';

@Injectable()
export class PortfoliosService {
	constructor(private readonly prisma: PrismaClient) {}

	private async findOwnedPortfolio(id: string, userId: string) {
		const portfolio = await this.prisma.portfolio.findUnique({
			where: { id },
		});

		if (!portfolio) {
			throw new NotFoundException(
				PORTFOLIO_ERROR_MESSAGES.PORTFOLIO_NOT_FOUND,
			);
		}

		if (portfolio.userId !== userId) {
			throw new ForbiddenException(
				PORTFOLIO_ERROR_MESSAGES.PORTFOLIO_ACCESS_DENIED,
			);
		}

		return portfolio;
	}

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
		const portfolio = await this.findOwnedPortfolio(id, userId);

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
		await this.findOwnedPortfolio(id, userId);

		const portfolioUpdated = await this.prisma.portfolio.update({
			where: { id },
			data: dto,
		});

		return portfolioToResponse(portfolioUpdated);
	}

	async delete(id: string, userId: string) {
		await this.findOwnedPortfolio(id, userId);

		await this.prisma.portfolio.delete({ where: { id } });
	}
}
