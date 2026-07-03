import {
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';

import { Portfolio, PrismaClient } from '@atlas/database';

import { PORTFOLIO_ERROR_MESSAGES } from '../constants/messages';

@Injectable()
export class PortfolioAccessService {
	constructor(private readonly prisma: PrismaClient) {}

	async assertOwned(portfolioId: string, userId: string): Promise<Portfolio> {
		const portfolio = await this.prisma.portfolio.findUnique({
			where: { id: portfolioId },
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
}
