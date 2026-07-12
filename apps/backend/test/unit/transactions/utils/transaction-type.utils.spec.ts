import {
	isCashType,
	isTradeType,
} from '@/transactions/utils/transaction-type.utils';

describe('transaction-type.utils', () => {
	describe('isTradeType', () => {
		it.each(['BUY', 'SELL'] as const)('возвращает true для %s', (type) => {
			expect(isTradeType(type)).toBe(true);
		});

		it.each(['DEPOSIT', 'WITHDRAWAL'] as const)(
			'возвращает false для %s',
			(type) => {
				expect(isTradeType(type)).toBe(false);
			},
		);
	});

	describe('isCashType', () => {
		it.each(['DEPOSIT', 'WITHDRAWAL'] as const)(
			'возвращает true для %s',
			(type) => {
				expect(isCashType(type)).toBe(true);
			},
		);

		it.each(['BUY', 'SELL'] as const)('возвращает false для %s', (type) => {
			expect(isCashType(type)).toBe(false);
		});
	});
});
