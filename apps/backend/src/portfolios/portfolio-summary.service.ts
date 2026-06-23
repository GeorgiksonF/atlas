import { Injectable } from '@nestjs/common';

import { PrismaClient } from '@atlas/database';
import type { PortfolioSummaryResponse } from '@atlas/types';

import { AssetsService } from '../assets/assets.service';
import { TransactionsService } from '../transactions/transactions.service';
import { portfolioWithTransactionToResponse } from './utils/adapters';
import { amountToRub, roundMoney, rubToUsd } from './utils/helper';
import {
	computePortfolioSummary,
	computeXirr,
	emptyPortfolioSummary,
	type Flow,
	sumPortfoliosSummaries,
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

		const summaries = portfolios.map((p) =>
			computePortfolioSummary(p.transactions, assets),
		);

		const sums = sumPortfoliosSummaries(summaries);

		const investorFlows: Flow[] = [];
		let netDepositsRub = 0;

		for (const p of portfolios) {
			for (const tx of p.transactions) {
				if (tx.type === 'DEPOSIT') {
					const cashFlow = amountToRub(tx.price, tx.currency);
					netDepositsRub += cashFlow;
					investorFlows.push({
						date: tx.date,
						cashFlow: -cashFlow,
					});
				} else if (tx.type === 'WITHDRAWAL') {
					const cashFlow = amountToRub(tx.price, tx.currency);
					netDepositsRub -= cashFlow;
					investorFlows.push({
						date: tx.date,
						cashFlow: cashFlow,
					});
				}
			}
		}

		investorFlows.push({ date: new Date(), cashFlow: sums.totalValue });
		const xirr = computeXirr(investorFlows);
		const annualizedReturnPercent =
			xirr !== null && Number.isFinite(xirr)
				? Math.round(xirr * 1e6) / 1e4
				: null;

		const profitPercentOfNetInvested =
			netDepositsRub > 1e-6
				? Math.round((sums.profit / netDepositsRub) * 1e6) / 1e4
				: null;

		return {
			totalValue: roundMoney(sums.totalValue),
			marketValue: roundMoney(sums.marketValue),
			cashBalance: roundMoney(sums.cashBalance),
			profit: roundMoney(sums.profit),
			profitPercentOfNetInvested,
			annualizedReturnPercent,
			dayChangeAmount: 0,
			dayChangePercent: null,
			primaryCurrency: 'RUB',
			alternativeCurrency: 'USD',
			alternativeTotalValue: roundMoney(rubToUsd(sums.totalValue)),
		};
	}
}
