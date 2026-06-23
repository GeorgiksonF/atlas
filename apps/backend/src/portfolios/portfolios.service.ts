import {
	BadRequestException,
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { PrismaClient } from '@atlas/database';
import type {
	CreatePortfolio,
	PortfolioResponse,
	PortfoliosResponse,
	UpdatePortfolio,
	BrokerResponse,
} from '@atlas/types';
import { PORTFOLIO_ERROR_MESSAGES } from './constants/messages';
import { PORTFOLIO_BROKERS, isPortfolioBroker } from './constants/broker';
import { portfolioToResponse } from './utils/adapters';

@Injectable()
export class PortfoliosService {
	constructor(private readonly prisma: PrismaClient) {}

	getBrokers(): BrokerResponse[] {
		return Object.keys(PORTFOLIO_BROKERS)
			.filter(isPortfolioBroker)
			.map((value) => ({
				value,
				label: PORTFOLIO_BROKERS[value],
			}));
	}

	async findAllByUserId(userId: string): Promise<PortfoliosResponse> {
		if (!userId) {
			throw new BadRequestException(
				PORTFOLIO_ERROR_MESSAGES.USER_ID_REQUIRED,
			);
		}
		const portfolio = await this.prisma.portfolio.findMany({
			where: { userId },
			orderBy: { createdAt: 'asc' },
		});

		return portfolio.map(portfolioToResponse);
	}

	async findById(id: string, userId: string): Promise<PortfolioResponse> {
		if (!userId) {
			throw new BadRequestException(
				PORTFOLIO_ERROR_MESSAGES.USER_ID_REQUIRED,
			);
		}
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
		return portfolioToResponse(portfolio);
	}

	async create(
		userId: string,
		dto: CreatePortfolio,
	): Promise<PortfolioResponse> {
		if (!userId) {
			throw new BadRequestException(
				PORTFOLIO_ERROR_MESSAGES.USER_ID_REQUIRED,
			);
		}
		const user = await this.prisma.user.findUnique({
			where: { id: userId },
		});
		if (!user) {
			throw new NotFoundException(
				PORTFOLIO_ERROR_MESSAGES.USER_NOT_FOUND,
			);
		}
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
		if (!userId) {
			throw new BadRequestException(
				PORTFOLIO_ERROR_MESSAGES.USER_ID_REQUIRED,
			);
		}
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
		const portfolioUpdated = await this.prisma.portfolio.update({
			where: { id },
			data: dto,
		});

		return portfolioToResponse(portfolioUpdated);
	}

	async delete(id: string, userId: string): Promise<void> {
		if (!userId) {
			throw new BadRequestException(
				PORTFOLIO_ERROR_MESSAGES.USER_ID_REQUIRED,
			);
		}
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
		await this.prisma.portfolio.delete({ where: { id } });
	}
}
