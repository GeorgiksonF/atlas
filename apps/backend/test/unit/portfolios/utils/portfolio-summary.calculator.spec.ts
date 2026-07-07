import {
	createAsset,
	createTestFx,
	createTransaction,
	d,
	resetFixtureCounters,
} from '@test/fixtures/portfolio-summary.fixtures';

import {
	computeAggregatedPortfolioSummary,
	computeDayChange,
	computePortfolioMetrics,
	computePortfolioSummary,
	computeReturnMetrics,
} from '@/portfolios/utils/portfolio-summary.calculator';
import type { Flow } from '@/portfolios/utils/xirr';

const MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000;

const oneYearLater = (start: Date): Date =>
	new Date(start.getTime() + MS_PER_YEAR);

const ASSET_ID = 'asset-aapl';
const FX = createTestFx();

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
		expect(computePortfolioMetrics([], assets, FX)).toEqual({
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
			FX,
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
			FX,
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
			FX,
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
			FX,
		);
		const reversed = computePortfolioMetrics(
			[sell, buy, deposit],
			assets,
			FX,
		);

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
			FX,
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
			FX,
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
			FX,
		);

		expect(metrics.marketValue).toBe(10);
		expect(metrics.profit).toBe(-990);
	});
});

describe('computeAggregatedPortfolioSummary', () => {
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

	it('возвращает empty summary для пустого списка портфелей', () => {
		const summary = computeAggregatedPortfolioSummary([], assets, FX);
		expect(summary.totalValue).toBe(0);
		expect(summary.marketValue).toBe(0);
	});

	it('суммирует метрики двух портфелей как один виртуальный', () => {
		const portfolioOne = [
			createTransaction({
				type: 'DEPOSIT',
				price: 100_000,
				quantity: 1,
				portfolioId: 'p1',
			}),
		];
		const portfolioTwo = [
			createTransaction({
				type: 'DEPOSIT',
				price: 50_000,
				quantity: 1,
				portfolioId: 'p2',
				date: d('2024-02-01'),
			}),
		];

		const summary = computeAggregatedPortfolioSummary(
			[portfolioOne, portfolioTwo],
			assets,
			FX,
		);

		expect(summary.totalValue).toBe(150_000);
		expect(summary.cashBalance).toBe(150_000);
		expect(summary.profit).toBe(0);
	});

	it('считает marketValue по объединённым позициям', () => {
		const buyPortfolioOne = [
			createTransaction({
				type: 'DEPOSIT',
				price: 100_000,
				portfolioId: 'p1',
			}),
			createTransaction({
				type: 'BUY',
				assetId: ASSET_ID,
				price: 5_000,
				quantity: 10,
				portfolioId: 'p1',
				date: d('2024-02-01'),
			}),
		];
		const buyPortfolioTwo = [
			createTransaction({
				type: 'DEPOSIT',
				price: 60_000,
				portfolioId: 'p2',
				date: d('2024-01-15'),
			}),
			createTransaction({
				type: 'BUY',
				assetId: ASSET_ID,
				price: 5_000,
				quantity: 2,
				portfolioId: 'p2',
				date: d('2024-02-02'),
			}),
		];

		const summary = computeAggregatedPortfolioSummary(
			[buyPortfolioOne, buyPortfolioTwo],
			assets,
			FX,
		);

		expect(summary.marketValue).toBe(72_000);
		expect(summary.totalValue).toBe(172_000);
	});
});

describe('computeDayChange', () => {
	it('возвращает null percent без данных за вчера', () => {
		expect(computeDayChange(110_000, null)).toEqual({
			dayChangeAmount: 0,
			dayChangePercent: null,
		});
	});

	it('считает изменение marketValue за день', () => {
		expect(computeDayChange(110_000, 100_000)).toEqual({
			dayChangeAmount: 10_000,
			dayChangePercent: 10,
		});
	});
});

describe('computePortfolioSummary dayChange', () => {
	const assets = [
		createAsset({
			id: ASSET_ID,
			ticker: 'AAPL',
			quote: { price: 110, currency: 'RUB' },
		}),
	];
	const yesterdayAssets = [
		createAsset({
			id: ASSET_ID,
			ticker: 'AAPL',
			quote: { price: 100, currency: 'RUB' },
		}),
	];

	beforeEach(() => {
		resetFixtureCounters();
	});

	it('считает dayChange по snapshot-котировкам за вчера', () => {
		const transactions = [
			createTransaction({
				type: 'DEPOSIT',
				price: 100_000,
			}),
			createTransaction({
				type: 'BUY',
				assetId: ASSET_ID,
				price: 100,
				quantity: 100,
				date: d('2024-01-01'),
			}),
		];

		const summary = computePortfolioSummary(transactions, assets, FX, {
			hasYesterdayQuoteData: true,
			yesterdayAssets,
			yesterdayCutoff: d('2024-01-01T23:59:59.999Z'),
		});

		expect(summary.marketValue).toBe(11_000);
		expect(summary.dayChangeAmount).toBe(1_000);
		expect(summary.dayChangePercent).toBeCloseTo(10, 6);
	});
});
