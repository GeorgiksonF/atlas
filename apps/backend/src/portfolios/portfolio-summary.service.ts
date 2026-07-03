import { Injectable } from '@nestjs/common';

import { PrismaClient } from '@atlas/database';
import type { PortfolioSummaryResponse } from '@atlas/types';

import { AssetsService } from '../assets/assets.service';
import { TransactionsService } from '../transactions/transactions.service';
import { portfolioWithTransactionToResponse } from './utils/adapters';
import {
	computeAggregatedPortfolioSummary,
	computePortfolioSummary,
	emptyPortfolioSummary,
} from './utils/portfolio-summary.calculator';

@Injectable()
export class PortfolioSummaryService {
	constructor(
		private readonly prisma: PrismaClient,
		private readonly transactionService: TransactionsService,
		private readonly assetsService: AssetsService,
	) {}

	async getSummaryForPortfolio(
		portfolioId: string,
		userId: string,
	): Promise<PortfolioSummaryResponse> {
		const transactions = await this.transactionService.findAllByPortfolioId(
			portfolioId,
			userId,
		);

		const assetsIds = [
			...new Set(
				transactions
					.map((tx) => tx.assetId)
					.filter((txId) => txId !== null),
			),
		];

		const assets = await this.assetsService.findByIdsWithQuotes(assetsIds);

		return computePortfolioSummary(transactions, assets);
	}

	async getSummaryForAllUserPortfolios(
		userId: string,
	): Promise<PortfolioSummaryResponse> {
		const response = await this.prisma.portfolio.findMany({
			where: { userId },
			include: {
				transactions: {
					orderBy: { date: 'asc' },
				},
			},
		});

		if (response.length === 0) {
			return emptyPortfolioSummary();
		}

		const portfolios = response.map(portfolioWithTransactionToResponse);

		const assets = await this.assetsService.findAllWithQuotes();

		return computeAggregatedPortfolioSummary(
			portfolios.map((p) => p.transactions),
			assets,
		);
	}
}
