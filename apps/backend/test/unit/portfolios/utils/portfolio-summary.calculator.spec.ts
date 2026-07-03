import {
	createAsset,
	createTransaction,
	d,
	resetFixtureCounters,
} from '@test/fixtures/portfolio-summary.fixtures';

import {
	computePortfolioMetrics,
	computeReturnMetrics,
} from '@/portfolios/utils/portfolio-summary.calculator';
import type { Flow } from '@/portfolios/utils/xirr';

const MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000;

const oneYearLater = (start: Date): Date =>
	new Date(start.getTime() + MS_PER_YEAR);

const ASSET_ID = 'asset-aapl';

describe('computeReturnMetrics', () => {
	beforeEach(() => {
		resetFixtureCounters();
		jest.useRealTimers();
	});

	it('считает profitPercentOfNetInvested как profit / чистые пополнения', () => {
		const result = computeReturnMetrics({
			netDepositsRub: 100_000,
			profitRub: 15_000,
			investorFlows: [],
			terminalValue: 115_000,
		});

		expect(result.profitPercentOfNetInvested).toBeCloseTo(15, 6);
	});

	it('возвращает null для profitPercentOfNetInvested при нулевых пополнениях', () => {
		const result = computeReturnMetrics({
			netDepositsRub: 0,
			profitRub: 10_000,
			investorFlows: [],
			terminalValue: 10_000,
		});

		expect(result.profitPercentOfNetInvested).toBeNull();
	});

	it('возвращает null для annualizedReturnPercent, если XIRR не посчитать', () => {
		const result = computeReturnMetrics({
			netDepositsRub: 100_000,
			profitRub: 5_000,
			investorFlows: [],
			terminalValue: 105_000,
		});

		expect(result.annualizedReturnPercent).toBeNull();
	});

	it('считает annualizedReturnPercent по потокам и текущей стоимости портфеля', () => {
		const investedAt = d('2024-06-01');
		const terminalAt = oneYearLater(investedAt);

		jest.useFakeTimers();
		jest.setSystemTime(terminalAt);

		const result = computeReturnMetrics({
			netDepositsRub: 100_000,
			profitRub: 10_000,
			investorFlows: [{ date: investedAt, cashFlow: -100_000 }],
			terminalValue: 110_000,
		});

		expect(result.annualizedReturnPercent).not.toBeNull();
		expect(result.annualizedReturnPercent).toBeCloseTo(10, 1);
	});

	it('не изменяет переданный массив investorFlows', () => {
		const investorFlows: Flow[] = [
			{ date: d('2024-01-01'), cashFlow: -100_000 },
		];
		const snapshot = [...investorFlows];

		computeReturnMetrics({
			netDepositsRub: 100_000,
			profitRub: 10_000,
			investorFlows,
			terminalValue: 110_000,
		});

		expect(investorFlows).toEqual(snapshot);
	});
});

describe('computePortfolioMetrics', () => {
	const assets = [
		createAsset({
			id: ASSET_ID,
			ticker: 'AAPL',
			quote: { price: 6000, currency: 'RUB' },
		}),
	];

	beforeEach(() => {
		resetFixtureCounters();
	});

	it('возвращает нулевые метрики для пустого списка транзакций', () => {
		expect(computePortfolioMetrics([], assets)).toEqual({
			totalValue: 0,
			marketValue: 0,
			cashBalance: 0,
			profit: 0,
			netDepositsRub: 0,
			investorFlows: [],
		});
	});

	it('считает портфель только из кэша после пополнения', () => {
		const metrics = computePortfolioMetrics(
			[
				createTransaction({
					type: 'DEPOSIT',
					price: 100_000,
					quantity: 1,
					currency: 'RUB',
				}),
			],
			assets,
		);

		expect(metrics.cashBalance).toBe(100_000);
		expect(metrics.marketValue).toBe(0);
		expect(metrics.totalValue).toBe(100_000);
		expect(metrics.profit).toBe(0);
		expect(metrics.netDepositsRub).toBe(100_000);
		expect(metrics.investorFlows).toEqual([
			{ date: d('2024-01-01'), cashFlow: -100_000 },
		]);
	});

	it('считает нереализованную прибыль по открытой позиции и котировке', () => {
		const metrics = computePortfolioMetrics(
			[
				createTransaction({
					type: 'DEPOSIT',
					price: 100_000,
					quantity: 1,
				}),
				createTransaction({
					type: 'BUY',
					assetId: ASSET_ID,
					price: 5_000,
					quantity: 10,
				}),
			],
			assets,
		);

		expect(metrics.cashBalance).toBe(50_000);
		expect(metrics.marketValue).toBe(60_000);
		expect(metrics.totalValue).toBe(110_000);
		expect(metrics.profit).toBe(10_000);
	});

	it('считает реализованную прибыль после продажи с доходом', () => {
		const metrics = computePortfolioMetrics(
			[
				createTransaction({
					type: 'DEPOSIT',
					price: 100_000,
					quantity: 1,
				}),
				createTransaction({
					type: 'BUY',
					assetId: ASSET_ID,
					price: 5_000,
					quantity: 10,
					date: d('2024-02-01'),
				}),
				createTransaction({
					type: 'SELL',
					assetId: ASSET_ID,
					price: 6_000,
					quantity: 10,
					date: d('2024-03-01'),
				}),
			],
			assets,
		);

		expect(metrics.cashBalance).toBe(110_000);
		expect(metrics.marketValue).toBe(0);
		expect(metrics.totalValue).toBe(110_000);
		expect(metrics.profit).toBe(10_000);
	});

	it('даёт разные метрики при обратном порядке транзакций (desc vs asc)', () => {
		const deposit = createTransaction({
			type: 'DEPOSIT',
			price: 100_000,
			quantity: 1,
			date: d('2024-01-01'),
		});
		const buy = createTransaction({
			type: 'BUY',
			assetId: ASSET_ID,
			price: 5_000,
			quantity: 10,
			date: d('2024-02-01'),
		});
		const sell = createTransaction({
			type: 'SELL',
			assetId: ASSET_ID,
			price: 6_000,
			quantity: 10,
			date: d('2024-03-01'),
		});

		const chronological = computePortfolioMetrics(
			[deposit, buy, sell],
			assets,
		);
		const reversed = computePortfolioMetrics([sell, buy, deposit], assets);

		expect(chronological.cashBalance).toBe(110_000);
		expect(chronological.totalValue).toBe(110_000);
		expect(chronological.profit).toBe(10_000);

		expect(reversed.profit).not.toBe(chronological.profit);
		expect(Number.isNaN(reversed.profit)).toBe(true);
	});

	it('уменьшает кэш и чистые пополнения после вывода', () => {
		const metrics = computePortfolioMetrics(
			[
				createTransaction({
					type: 'DEPOSIT',
					price: 100_000,
					quantity: 1,
				}),
				createTransaction({
					type: 'WITHDRAWAL',
					price: 20_000,
					quantity: 1,
					date: d('2024-02-01'),
				}),
			],
			assets,
		);

		expect(metrics.cashBalance).toBe(80_000);
		expect(metrics.totalValue).toBe(80_000);
		expect(metrics.netDepositsRub).toBe(80_000);
		expect(metrics.investorFlows).toEqual([
			{ date: d('2024-01-01'), cashFlow: -100_000 },
			{ date: d('2024-02-01'), cashFlow: 20_000 },
		]);
	});

	it('конвертирует USD-транзакции в RUB по фиксированному курсу', () => {
		const metrics = computePortfolioMetrics(
			[
				createTransaction({
					type: 'DEPOSIT',
					price: 1_000,
					quantity: 1,
					currency: 'USD',
				}),
			],
			assets,
		);

		expect(metrics.cashBalance).toBe(90_000);
		expect(metrics.netDepositsRub).toBe(90_000);
	});

	it('использует цену 1 RUB, если у актива нет котировки', () => {
		const metrics = computePortfolioMetrics(
			[
				createTransaction({
					type: 'DEPOSIT',
					price: 10_000,
					quantity: 1,
				}),
				createTransaction({
					type: 'BUY',
					assetId: 'asset-no-quote',
					price: 100,
					quantity: 10,
				}),
			],
			[createAsset({ id: 'asset-no-quote', ticker: 'NOQ' })],
		);

		expect(metrics.marketValue).toBe(10);
		expect(metrics.profit).toBe(-990);
	});
});
