import type { CurrencyType } from './quotes';

export type TransactionType = 'BUY' | 'SELL' | 'DEPOSIT' | 'WITHDRAWAL';

export type CreateTransaction = {
	assetId?: string | null;
	quantity: number;
	price: number;
	type: TransactionType;
	date: string;
	currency: CurrencyType;
};

export type UpdateTransaction = Partial<CreateTransaction>;

export type TransactionResponse = {
	id: string;
	quantity: number;
	price: number;
	type: TransactionType;
	date: Date;
	currency: CurrencyType;
	createdAt: Date;
	portfolioId: string;
	assetId: string | null;
};

export type TransactionsResponse = TransactionResponse[];
