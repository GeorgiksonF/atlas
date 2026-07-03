import type {
	AssetWithQuoteResponse,
	TransactionResponse,
	TransactionType,
} from '@atlas/types';

let transactionIdCounter = 0;

export const resetFixtureCounters = (): void => {
	transactionIdCounter = 0;
};

export const d = (isoDate: string): Date => new Date(isoDate);

export const createTransaction = (
	overrides: Partial<TransactionResponse> & {
		type: TransactionType;
		price: number;
	},
): TransactionResponse => {
	transactionIdCounter += 1;

	return {
		id: `tx-${transactionIdCounter}`,
		quantity: 1,
		currency: 'RUB',
		date: d('2024-01-01'),
		createdAt: d('2024-01-01'),
		portfolioId: 'portfolio-1',
		assetId: null,
		...overrides,
	};
};

export const createAsset = (
	overrides: Partial<AssetWithQuoteResponse> & { id: string },
): AssetWithQuoteResponse => ({
	name: 'Test Asset',
	ticker: 'TEST',
	type: 'STOCK',
	createdAt: d('2024-01-01'),
	updatedAt: d('2024-01-01'),
	...overrides,
});
