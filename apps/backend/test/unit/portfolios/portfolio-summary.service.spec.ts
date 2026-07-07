jest.mock('@/assets/assets.service', () => ({
	AssetsService: class AssetsService {},
}));
jest.mock('@/transactions/transactions.service', () => ({
	TransactionsService: class TransactionsService {},
}));
jest.mock('@/fx/fx-rate.service', () => ({
	FxRateService: class FxRateService {},
}));
jest.mock('@/quotes/persistence/quote-snapshot.repository', () => ({
	QuoteSnapshotRepository: class QuoteSnapshotRepository {},
}));

import {
	createAsset,
	createTestFx,
	createTransaction,
	d,
} from '@test/fixtures/portfolio-summary.fixtures';

import type { AssetsService } from '@/assets/assets.service';
import type { FxRateService } from '@/fx/fx-rate.service';
import { PortfolioSummaryService } from '@/portfolios/portfolio-summary.service';
import type { QuoteSnapshotRepository } from '@/quotes/persistence/quote-snapshot.repository';
import type { TransactionsService } from '@/transactions/transactions.service';

describe('PortfolioSummaryService', () => {
	const fx = createTestFx();
	let transactionService: jest.Mocked<
		Pick<
			TransactionsService,
			| 'findAllByPortfolioIdChronological'
			| 'findAllChronologicalGroupedByUserPortfolios'
		>
	>;
	let assetsService: jest.Mocked<Pick<AssetsService, 'findByIdsWithQuotes'>>;
	let fxRateService: jest.Mocked<
		Pick<FxRateService, 'buildConversionContext'>
	>;
	let quoteSnapshotRepository: jest.Mocked<
		Pick<
			QuoteSnapshotRepository,
			'hasSnapshotsForAssetIds' | 'findByAssetIdsAndCalendarDate'
		>
	>;
	let service: PortfolioSummaryService;

	beforeEach(() => {
		transactionService = {
			findAllByPortfolioIdChronological: jest.fn(),
			findAllChronologicalGroupedByUserPortfolios: jest.fn(),
		};
		assetsService = {
			findByIdsWithQuotes: jest.fn(),
		};
		fxRateService = {
			buildConversionContext: jest.fn().mockResolvedValue(fx),
		};
		quoteSnapshotRepository = {
			hasSnapshotsForAssetIds: jest.fn().mockResolvedValue(false),
			findByAssetIdsAndCalendarDate: jest
				.fn()
				.mockResolvedValue(new Map()),
		};

		service = new PortfolioSummaryService(
			transactionService as unknown as TransactionsService,
			assetsService as unknown as AssetsService,
			fxRateService as unknown as FxRateService,
			quoteSnapshotRepository as unknown as QuoteSnapshotRepository,
		);
	});

	it('getSummaryForPortfolio запрашивает только нужные assets', async () => {
		const assetId = 'asset-1';
		transactionService.findAllByPortfolioIdChronological.mockResolvedValue([
			createTransaction({ type: 'DEPOSIT', price: 100_000 }),
			createTransaction({
				type: 'BUY',
				price: 1_000,
				assetId,
				date: d('2024-02-01'),
			}),
		]);
		assetsService.findByIdsWithQuotes.mockResolvedValue([
			createAsset({
				id: assetId,
				quote: { price: 1_200, currency: 'RUB' },
			}),
		]);

		const summary = await service.getSummaryForPortfolio('p1', 'user-1');

		expect(assetsService.findByIdsWithQuotes).toHaveBeenCalledWith([
			assetId,
		]);
		expect(summary.totalValue).toBeGreaterThan(0);
	});

	it('getSummaryForAllUserPortfolios не использует findAllWithQuotes', async () => {
		transactionService.findAllChronologicalGroupedByUserPortfolios.mockResolvedValue(
			[
				[
					createTransaction({
						type: 'DEPOSIT',
						price: 50_000,
						portfolioId: 'p1',
					}),
				],
			],
		);
		assetsService.findByIdsWithQuotes.mockResolvedValue([]);

		await service.getSummaryForAllUserPortfolios('user-1');

		expect(assetsService.findByIdsWithQuotes).toHaveBeenCalledWith([]);
		expect(
			transactionService.findAllChronologicalGroupedByUserPortfolios,
		).toHaveBeenCalledWith('user-1');
	});
});
