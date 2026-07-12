import type { Transaction } from '@atlas/database';

import { transactionToResponse } from '@/transactions/utils/adapters';

const createTransaction = (
	overrides: Partial<Transaction> = {},
): Transaction => ({
	id: 'tx-1',
	portfolioId: 'portfolio-1',
	assetId: 'asset-1',
	quantity: 10,
	price: '123.45' as unknown as Transaction['price'],
	type: 'BUY',
	date: new Date('2024-06-01'),
	currency: 'RUB',
	createdAt: new Date('2024-06-01'),
	...overrides,
});

describe('transactionToResponse', () => {
	it('преобразует Decimal price в number', () => {
		const result = transactionToResponse(createTransaction());

		expect(result.price).toBe(123.45);
		expect(typeof result.price).toBe('number');
	});

	it('сохраняет остальные поля транзакции', () => {
		const row = createTransaction({
			id: 'tx-42',
			type: 'DEPOSIT',
			assetId: null,
			currency: 'USD',
		});

		const result = transactionToResponse(row);

		expect(result.id).toBe('tx-42');
		expect(result.type).toBe('DEPOSIT');
		expect(result.assetId).toBeNull();
		expect(result.currency).toBe('USD');
	});
});
