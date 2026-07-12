import { Injectable } from '@nestjs/common';

import type { QuoteProviderItem } from '@atlas/types';

import {
	MOEX_QUOTE_BOARD,
	MOEX_QUOTE_ENGINE,
	MOEX_QUOTE_MARKET,
} from '../../../integrations/moex/moex.constants';
import { moexCellToNumber } from '../../../integrations/moex/moex-cell.utils';
import { MoexHttpClient } from '../../../integrations/moex/moex-http.client';
import {
	getCellValue,
	getColumnIndex,
	getFirstRow,
	type MoexIssResponse,
	type MoexIssTable,
	parseIssBlock,
} from '../../../integrations/moex/moex-iss.parser';
import type { IQuoteProvider } from '../../contract/quote-provider.interface';

const extractQuoteFromMarketdata = (
	table: MoexIssTable,
): { price: number } | null => {
	const lastIdx = getColumnIndex(table.columns, 'LAST');
	const row = getFirstRow(table);
	if (!row) return null;

	const price = moexCellToNumber(getCellValue(row, lastIdx));
	if (price === null || price <= 0) return null;

	return { price };
};

@Injectable()
export class MoexQuoteProvider implements IQuoteProvider {
	constructor(private readonly client: MoexHttpClient) {}

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
