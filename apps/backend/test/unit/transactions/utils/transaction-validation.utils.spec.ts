import { BadRequestException } from '@nestjs/common';

import type { Transaction } from '@atlas/database';
import type { CreateTransaction, UpdateTransaction } from '@atlas/types';

import { TRANSACTION_ERROR_MESSAGES } from '@/transactions/constants/messages';
import {
	assertNoNegativeAssetPositions,
	assertValidCreatePayload,
	assertValidUpdatePayload,
	normalizeCreatePayload,
	normalizeUpdateData,
	resolveEffectiveAssetId,
	resolveEffectiveType,
} from '@/transactions/utils/transaction-validation.utils';

const PORTFOLIO_ID = 'portfolio-1';
const ASSET_ID = 'asset-1';

const createDto = (
	overrides: Partial<CreateTransaction> = {},
): CreateTransaction => ({
	quantity: 10,
	price: 100,
	type: 'BUY',
	date: '2024-06-01',
	currency: 'RUB',
	assetId: ASSET_ID,
	...overrides,
});

const positionTransaction = (
	overrides: {
		assetId?: string | null;
		createdAt?: Date;
		date?: Date;
		quantity?: number;
		type?: Transaction['type'];
	} = {},
) => ({
	assetId: ASSET_ID,
	createdAt: new Date('2024-06-01T10:00:00.000Z'),
	date: new Date('2024-06-01'),
	quantity: 10,
	type: 'BUY' as Transaction['type'],
	...overrides,
});

const existingTransaction = (
	overrides: Partial<Transaction> = {},
): Transaction => ({
	id: 'tx-1',
	portfolioId: PORTFOLIO_ID,
	assetId: ASSET_ID,
	quantity: 10,
	price: 100 as unknown as Transaction['price'],
	type: 'BUY',
	date: new Date('2024-06-01'),
	currency: 'RUB',
	createdAt: new Date('2024-06-01'),
	...overrides,
});

describe('assertValidCreatePayload', () => {
	it('пропускает trade с assetId', () => {
		expect(() =>
			assertValidCreatePayload(
				createDto({ type: 'BUY', assetId: ASSET_ID }),
			),
		).not.toThrow();
	});

	it('бросает 400 для trade без assetId', () => {
		expect(() =>
			assertValidCreatePayload(
				createDto({ type: 'SELL', assetId: null }),
			),
		).toThrow(
			new BadRequestException(
				TRANSACTION_ERROR_MESSAGES.ASSET_REQUIRED_FOR_TRADE,
			),
		);
	});

	it('бросает 400 для cash с assetId', () => {
		expect(() =>
			assertValidCreatePayload(
				createDto({ type: 'DEPOSIT', assetId: ASSET_ID }),
			),
		).toThrow(
			new BadRequestException(
				TRANSACTION_ERROR_MESSAGES.ASSET_FORBIDDEN_FOR_CASH,
			),
		);
	});
});

describe('normalizeCreatePayload', () => {
	it('для cash обнуляет assetId и ставит quantity = 1', () => {
		const result = normalizeCreatePayload(
			createDto({ type: 'DEPOSIT', assetId: null, quantity: 99 }),
			PORTFOLIO_ID,
		);

		expect(result.assetId).toBeNull();
		expect(result.quantity).toBe(1);
		expect(result.portfolioId).toBe(PORTFOLIO_ID);
		expect(result.date).toEqual(new Date('2024-06-01'));
	});

	it('для trade сохраняет assetId и quantity из dto', () => {
		const result = normalizeCreatePayload(createDto(), PORTFOLIO_ID);

		expect(result.assetId).toBe(ASSET_ID);
		expect(result.quantity).toBe(10);
	});
});

describe('assertNoNegativeAssetPositions', () => {
	it('пропускает продажу в пределах текущей позиции', () => {
		expect(() =>
			assertNoNegativeAssetPositions([
				positionTransaction({ type: 'BUY', quantity: 10 }),
				positionTransaction({
					type: 'SELL',
					quantity: 4,
					date: new Date('2024-06-02'),
					createdAt: new Date('2024-06-02T10:00:00.000Z'),
				}),
			]),
		).not.toThrow();
	});

	it('бросает 400 при продаже больше текущей позиции', () => {
		expect(() =>
			assertNoNegativeAssetPositions([
				positionTransaction({ type: 'BUY', quantity: 3 }),
				positionTransaction({
					type: 'SELL',
					quantity: 4,
					date: new Date('2024-06-02'),
					createdAt: new Date('2024-06-02T10:00:00.000Z'),
				}),
			]),
		).toThrow(
			new BadRequestException(
				TRANSACTION_ERROR_MESSAGES.INSUFFICIENT_ASSET_QUANTITY,
			),
		);
	});

	it('учитывает хронологию сделок при вставке продажи задним числом', () => {
		expect(() =>
			assertNoNegativeAssetPositions([
				positionTransaction({
					type: 'BUY',
					quantity: 10,
					date: new Date('2024-06-02'),
					createdAt: new Date('2024-06-02T10:00:00.000Z'),
				}),
				positionTransaction({
					type: 'SELL',
					quantity: 1,
					date: new Date('2024-06-01'),
					createdAt: new Date('2024-06-03T10:00:00.000Z'),
				}),
			]),
		).toThrow(
			new BadRequestException(
				TRANSACTION_ERROR_MESSAGES.INSUFFICIENT_ASSET_QUANTITY,
			),
		);
	});
});

describe('assertValidUpdatePayload', () => {
	it('бросает 400 при смене type на trade без assetId', () => {
		const existing = existingTransaction({
			type: 'DEPOSIT',
			assetId: null,
		});

		expect(() =>
			assertValidUpdatePayload({ type: 'BUY' }, existing),
		).toThrow(
			new BadRequestException(
				TRANSACTION_ERROR_MESSAGES.ASSET_REQUIRED_FOR_TRADE,
			),
		);
	});

	it('пропускает смену type на trade с assetId в dto', () => {
		const existing = existingTransaction({
			type: 'DEPOSIT',
			assetId: null,
		});

		const result = assertValidUpdatePayload(
			{ type: 'BUY', assetId: ASSET_ID },
			existing,
		);

		expect(result.effectiveType).toBe('BUY');
		expect(result.effectiveAssetId).toBe(ASSET_ID);
	});

	it('бросает 400 если для cash явно передан assetId', () => {
		const existing = existingTransaction({ type: 'BUY' });

		expect(() =>
			assertValidUpdatePayload(
				{ type: 'DEPOSIT', assetId: ASSET_ID },
				existing,
			),
		).toThrow(
			new BadRequestException(
				TRANSACTION_ERROR_MESSAGES.ASSET_FORBIDDEN_FOR_CASH,
			),
		);
	});
});

describe('resolveEffectiveType', () => {
	it('берёт type из dto, если передан', () => {
		const existing = existingTransaction({ type: 'BUY' });

		expect(resolveEffectiveType({ type: 'SELL' }, existing)).toBe('SELL');
	});

	it('берёт type из existing, если в dto не передан', () => {
		const existing = existingTransaction({ type: 'WITHDRAWAL' });

		expect(resolveEffectiveType({}, existing)).toBe('WITHDRAWAL');
	});
});

describe('resolveEffectiveAssetId', () => {
	it('возвращает null для cash type', () => {
		const existing = existingTransaction({
			type: 'BUY',
			assetId: ASSET_ID,
		});

		expect(resolveEffectiveAssetId({}, existing, 'DEPOSIT')).toBeNull();
	});

	it('берёт assetId из dto, если передан для trade', () => {
		const existing = existingTransaction({ assetId: 'old-asset' });
		const newAssetId = 'new-asset';

		expect(
			resolveEffectiveAssetId({ assetId: newAssetId }, existing, 'SELL'),
		).toBe(newAssetId);
	});

	it('берёт assetId из existing для trade, если в dto не передан', () => {
		const existing = existingTransaction({ assetId: ASSET_ID });

		expect(resolveEffectiveAssetId({}, existing, 'BUY')).toBe(ASSET_ID);
	});
});

describe('normalizeUpdateData', () => {
	it('auto-null assetId и quantity=1 при смене type на cash', () => {
		const existing = existingTransaction({
			type: 'BUY',
			assetId: ASSET_ID,
		});
		const dto: UpdateTransaction = { type: 'DEPOSIT' };

		const result = normalizeUpdateData(dto, existing, 'DEPOSIT', null);

		expect(result.assetId).toBeNull();
		expect(result.quantity).toBe(1);
		expect(result.type).toBe('DEPOSIT');
	});

	it('не трогает assetId при обновлении только price', () => {
		const existing = existingTransaction();
		const dto: UpdateTransaction = { price: 200 };

		const result = normalizeUpdateData(dto, existing, 'BUY', ASSET_ID);

		expect(result.assetId).toBeUndefined();
		expect(result.price).toBe(200);
	});

	it('проставляет quantity=1 для cash, если quantity передан в dto', () => {
		const existing = existingTransaction({
			type: 'DEPOSIT',
			assetId: null,
		});
		const dto: UpdateTransaction = { quantity: 50 };

		const result = normalizeUpdateData(dto, existing, 'DEPOSIT', null);

		expect(result.quantity).toBe(1);
	});
});
