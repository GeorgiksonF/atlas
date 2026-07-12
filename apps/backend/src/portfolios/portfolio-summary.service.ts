import { Injectable } from '@nestjs/common';

import type {
	AssetWithQuoteResponse,
	PortfolioSummaryResponse,
} from '@atlas/types';

import { AssetsService } from '../assets/assets.service';
import { FxRateService } from '../fx/fx-rate.service';
import {
	applySnapshotQuotesToAssets,
	QuoteSnapshotRepository,
} from '../quotes/persistence/quote-snapshot.repository';
import { TransactionsService } from '../transactions/transactions.service';
import {
	endOfMoscowCalendarDateUtc,
	yesterdayMoscowCalendarDate,
} from './utils/moscow-date.utils';
import {
	computeAggregatedPortfolioSummary,
	computePortfolioSummary,
	emptyPortfolioSummary,
} from './utils/portfolio-summary.calculator';
import { collectAssetIds } from './utils/summary-data.utils';

@Injectable()
export class PortfolioSummaryService {
	constructor(
		private readonly transactionService: TransactionsService,
		private readonly assetsService: AssetsService,
		private readonly fxRateService: FxRateService,
		private readonly quoteSnapshotRepository: QuoteSnapshotRepository,
	) {}

	async getSummaryForPortfolio(
		portfolioId: string,
		userId: string,
	): Promise<PortfolioSummaryResponse> {
		const transactions =
			await this.transactionService.findAllByPortfolioIdChronological(
				portfolioId,
				userId,
			);

		return this.buildSummary(transactions);
	}

	async getSummaryForAllUserPortfolios(
		userId: string,
	): Promise<PortfolioSummaryResponse> {
		const transactionsByPortfolio =
			await this.transactionService.findAllChronologicalGroupedByUserPortfolios(
				userId,
			);

		if (transactionsByPortfolio.length === 0) {
			const fx = await this.fxRateService.buildConversionContext();
			return emptyPortfolioSummary(fx);
		}

		const allTransactions = transactionsByPortfolio.flat();
		const assetIds = collectAssetIds(allTransactions);
		const assets = await this.assetsService.findByIdsWithQuotes(assetIds);
		const fx =
			await this.fxRateService.buildConversionContext(allTransactions);
		const dayChangeContext = await this.buildDayChangeContext(
			assetIds,
			assets,
		);

		return computeAggregatedPortfolioSummary(
			transactionsByPortfolio,
			assets,
			fx,
			dayChangeContext,
		);
	}

	private async buildSummary(
		transactions: Awaited<
			ReturnType<TransactionsService['findAllByPortfolioIdChronological']>
		>,
	): Promise<PortfolioSummaryResponse> {
		const assetIds = collectAssetIds(transactions);
		const assets = await this.assetsService.findByIdsWithQuotes(assetIds);
		const fx =
			await this.fxRateService.buildConversionContext(transactions);
		const dayChangeContext = await this.buildDayChangeContext(
			assetIds,
			assets,
		);

		return computePortfolioSummary(
			transactions,
			assets,
			fx,
			dayChangeContext,
		);
	}

	private async buildDayChangeContext(
		assetIds: string[],
		assets: AssetWithQuoteResponse[],
	) {
		const yesterdayDate = yesterdayMoscowCalendarDate();
		const hasYesterdayQuoteData =
			assetIds.length > 0 &&
			(await this.quoteSnapshotRepository.hasSnapshotsForAssetIds(
				assetIds,
				yesterdayDate,
			));

		if (!hasYesterdayQuoteData) {
			return { hasYesterdayQuoteData: false };
		}

		const snapshots =
			await this.quoteSnapshotRepository.findByAssetIdsAndCalendarDate(
				assetIds,
				yesterdayDate,
			);

		return {
			hasYesterdayQuoteData: true,
			yesterdayAssets: applySnapshotQuotesToAssets(assets, snapshots),
			yesterdayCutoff: endOfMoscowCalendarDateUtc(yesterdayDate),
		};
	}
}
