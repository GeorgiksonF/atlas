import { Injectable } from '@nestjs/common';
import type { QuoteProviderItem } from '@atlas/types';
import type { IQuoteProvider } from '../../contract/quote-provider.interface';

const MOEX_ISS_BASE = 'https://iss.moex.com/iss';
const ENGINE = 'stock';
const MARKET = 'shares';
const BOARD = 'TQBR';

interface MoexSecurityResponse {
	securities?: { columns: string[]; data: unknown[][] };
	marketdata?: { columns: string[]; data: unknown[][] };
}

@Injectable()
export class MoexQuoteProvider implements IQuoteProvider {
	async getQuotes(tickers: string[]): Promise<QuoteProviderItem[]> {
		const results: QuoteProviderItem[] = [];
		for (const ticker of tickers) {
			const normalized = ticker.trim().toUpperCase();
			if (!normalized) continue;
			try {
				const item = await this.fetchOne(normalized);
				if (item) results.push(item);
			} catch {
				// Пропускаем тикер при ошибке (сеть, биржа не ответила, бумага не найдена)
			}
		}
		return results;
	}

	private async fetchOne(ticker: string): Promise<QuoteProviderItem | null> {
		const url = `${MOEX_ISS_BASE}/engines/${ENGINE}/markets/${MARKET}/boards/${BOARD}/securities/${ticker}.json?iss.meta=off`;
		const res = await fetch(url);
		if (!res.ok) return null;
		const json = (await res.json()) as MoexSecurityResponse;
		const marketdata = json.marketdata;
		if (!marketdata?.columns?.length || !marketdata.data?.length)
			return null;
		const cols = marketdata.columns;
		const row = marketdata.data[0];
		const lastIdx = cols.indexOf('LAST');
		if (lastIdx === -1) return null;
		const rawPrice = row[lastIdx];
		const price =
			typeof rawPrice === 'number' ? rawPrice : Number(rawPrice);
		if (Number.isNaN(price) || price <= 0) return null;
		return {
			ticker,
			price,
			currency: 'RUB',
			updatedAt: new Date(),
		};
	}
}
