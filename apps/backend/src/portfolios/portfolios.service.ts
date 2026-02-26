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
} from '@atlas/types';
import { PORTFOLIO_ERROR_MESSAGES } from './constants/messages';

@Injectable()
export class PortfoliosService {
	constructor(private readonly prisma: PrismaClient) {}

	async findAllByUserId(userId: string): Promise<PortfoliosResponse> {
		if (!userId) {
			throw new BadRequestException(
				PORTFOLIO_ERROR_MESSAGES.USER_ID_REQUIRED,
			);
		}
		return this.prisma.portfolio.findMany({
			where: { userId },
		});
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
		return this.prisma.portfolio.create({
			data: {
				userId,
				...dto,
			},
		});
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
		return this.prisma.portfolio.update({
			where: { id },
			data: dto,
		});
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
