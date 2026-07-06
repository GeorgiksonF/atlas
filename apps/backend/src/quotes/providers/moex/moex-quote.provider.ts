import { Injectable } from '@nestjs/common';

import type { QuoteProviderItem } from '@atlas/types';

import {
	MOEX_QUOTE_BOARD,
	MOEX_QUOTE_ENGINE,
	MOEX_QUOTE_MARKET,
} from '../../../integrations/moex/moex.constants';
import { MoexHttpClient } from '../../../integrations/moex/moex-http.client';
import { parseIssBlock } from '../../../integrations/moex/moex-iss.parser';
import type { MoexIssResponse } from '../../../integrations/moex/moex-iss.types';
import { extractQuoteFromMarketdata } from '../../../integrations/moex/moex-quote.parser';
import type { IQuoteProvider } from '../../contract/quote-provider.interface';

@Injectable()
export class MoexQuoteProvider implements IQuoteProvider {
	private readonly client = new MoexHttpClient();

	async getQuotes(tickers: string[]): Promise<QuoteProviderItem[]> {
		const results: QuoteProviderItem[] = [];
		for (const ticker of tickers) {
			const normalized = ticker.trim().toUpperCase();
			if (!normalized) continue;

			const item = await this.fetchOne(normalized);
			if (item) results.push(item);
		}
		return results;
	}

	private async fetchOne(ticker: string): Promise<QuoteProviderItem | null> {
		const path = `/engines/${MOEX_QUOTE_ENGINE}/markets/${MOEX_QUOTE_MARKET}/boards/${MOEX_QUOTE_BOARD}/securities/${ticker}.json`;
		const json = await this.client.fetchJson<MoexIssResponse>(path);
		if (!json) return null;

		const marketdata = parseIssBlock(json, 'marketdata');
		if (!marketdata) return null;

		const quote = extractQuoteFromMarketdata(marketdata);
		if (!quote) return null;

		return {
			ticker,
			price: quote.price,
			currency: 'RUB',
			updatedAt: new Date(),
		};
	}
}
