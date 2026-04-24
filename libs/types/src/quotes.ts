export type CurrencyType = 'RUB' | 'USD';

export type QuoteResponse = {
	id: string;
	price: number;
	currency: CurrencyType;
	updatedAt: Date;
	assetId: string;
};

export type QuoteProviderItem = {
	ticker: string;
	price: number;
	currency: CurrencyType;
	updatedAt: Date;
};
