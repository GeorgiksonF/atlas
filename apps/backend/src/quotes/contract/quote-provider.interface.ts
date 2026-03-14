import type { QuoteProviderItem } from '@atlas/types';

export interface IQuoteProvider {
	getQuotes(tickers: string[]): Promise<QuoteProviderItem[]>;
}

export const QUOTE_PROVIDER = Symbol('QUOTE_PROVIDER');
