import {
	createTransaction,
	d,
	resetFixtureCounters,
} from '@test/fixtures/portfolio-summary.fixtures';

import {
	collectAssetIds,
	compareTransactionsChronologically,
	mergeTransactionsChronologically,
} from '@/portfolios/utils/summary-data.utils';

describe('summary-data.utils', () => {
	beforeEach(() => {
		resetFixtureCounters();
	});

	it('collectAssetIds возвращает уникальные id без null', () => {
		const txs = [
			createTransaction({ type: 'BUY', price: 1, assetId: 'a1' }),
			createTransaction({ type: 'BUY', price: 1, assetId: 'a1' }),
			createTransaction({ type: 'BUY', price: 1, assetId: 'a2' }),
			createTransaction({ type: 'DEPOSIT', price: 1, assetId: null }),
		];

		expect(collectAssetIds(txs)).toEqual(['a1', 'a2']);
	});

	it('mergeTransactionsChronologically сортирует по date и createdAt', () => {
		const early = createTransaction({
			type: 'DEPOSIT',
			price: 1,
			date: d('2024-01-01'),
			createdAt: d('2024-01-01T10:00:00'),
		});
		const lateSameDay = createTransaction({
			type: 'DEPOSIT',
			price: 2,
			date: d('2024-01-01'),
			createdAt: d('2024-01-01T12:00:00'),
		});
		const nextDay = createTransaction({
			type: 'DEPOSIT',
			price: 3,
			date: d('2024-01-02'),
			createdAt: d('2024-01-02T09:00:00'),
		});

		const merged = mergeTransactionsChronologically([
			[nextDay, early],
			[lateSameDay],
		]);

		expect(merged.map((tx) => tx.price)).toEqual([1, 2, 3]);
	});

	it('compareTransactionsChronologically упорядочивает по дате', () => {
		const a = createTransaction({
			type: 'DEPOSIT',
			price: 1,
			date: d('2024-01-01'),
		});
		const b = createTransaction({
			type: 'DEPOSIT',
			price: 2,
			date: d('2024-01-02'),
		});

		expect(compareTransactionsChronologically(a, b)).toBeLessThan(0);
	});
});
