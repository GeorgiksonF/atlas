import { Injectable } from '@nestjs/common';
import type { AssetSearchItem, AssetType } from '@atlas/types';

const MOEX_ISS_BASE = 'https://iss.moex.com/iss';
const SEARCH_LIMIT = 20;

interface MoexSecuritiesResponse {
	securities?: { columns: string[]; data: unknown[][] };
}

const MOEX_TYPE_TO_ASSET: Record<string, AssetType> = {
	common_share: 'STOCK',
	preferred_share: 'STOCK',
	exchange_bond: 'BOND',
	corporate_bond: 'BOND',
	stock_index_pf: 'FUND',
	stock_index_if: 'FUND',
};

function moexCellToString(value: unknown): string {
	if (value === null || value === undefined) return '';
	if (typeof value === 'string') return value.trim();
	if (typeof value === 'number' || typeof value === 'boolean') {
		return String(value).trim();
	}
	return '';
}

@Injectable()
export class MoexSearchService {
	async search(query: string): Promise<AssetSearchItem[]> {
		const q = query.trim();
		if (!q) return [];

		try {
			const url = `${MOEX_ISS_BASE}/securities.json?q=${encodeURIComponent(q)}&iss.meta=off`;
			const res = await fetch(url);
			if (!res.ok) return [];

			const json = (await res.json()) as MoexSecuritiesResponse;
			const securities = json.securities;
			if (!securities?.columns?.length || !securities.data?.length)
				return [];

			const cols = securities.columns;
			const secidIdx = cols.indexOf('secid');
			const shortnameIdx = cols.indexOf('shortname');
			const nameIdx = cols.indexOf('name');
			const typeIdx = cols.indexOf('type');
			const isTradedIdx = cols.indexOf('is_traded');

			if (secidIdx === -1 || shortnameIdx === -1) return [];

			const results: AssetSearchItem[] = [];
			for (const row of securities.data) {
				if (results.length >= SEARCH_LIMIT) break;

				const isTraded = isTradedIdx >= 0 ? row[isTradedIdx] : 1;
				if (isTraded !== 1) continue;

				const ticker = moexCellToString(row[secidIdx]);
				const shortname = moexCellToString(row[shortnameIdx]);
				const fullName =
					nameIdx >= 0 ? moexCellToString(row[nameIdx]) : shortname;
				const moexType =
					typeIdx >= 0
						? moexCellToString(row[typeIdx])
						: 'common_share';

				if (!ticker) continue;

				const type: AssetType = MOEX_TYPE_TO_ASSET[moexType] ?? 'STOCK';

				results.push({
					ticker: ticker.toUpperCase(),
					name: shortname || fullName || ticker,
					type,
				});
			}

			return results;
		} catch {
			return [];
		}
	}
}
