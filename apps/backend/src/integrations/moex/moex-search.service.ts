import { Injectable } from '@nestjs/common';

import type { AssetSearchItem, AssetType } from '@atlas/types';

import { moexCellToString } from './moex-cell.utils';
import { MoexHttpClient } from './moex-http.client';
import {
	getCellValue,
	getColumnIndex,
	type MoexIssResponse,
	parseIssBlock,
} from './moex-iss.parser';

const SEARCH_LIMIT = 20;

const MOEX_TYPE_TO_ASSET: Record<string, AssetType> = {
	common_share: 'STOCK',
	preferred_share: 'STOCK',
	exchange_bond: 'BOND',
	corporate_bond: 'BOND',
	stock_index_pf: 'FUND',
	stock_index_if: 'FUND',
};

const mapMoexTypeToAssetType = (moexType: string): AssetType =>
	MOEX_TYPE_TO_ASSET[moexType] ?? 'STOCK';

@Injectable()
export class MoexSearchService {
	constructor(private readonly client: MoexHttpClient) {}

	async search(query: string): Promise<AssetSearchItem[]> {
		const q = query.trim();
		if (!q) return [];

		const path = `/securities.json?q=${encodeURIComponent(q)}`;
		const json = await this.client.fetchJson<MoexIssResponse>(path);
		if (!json) return [];

		const securities = parseIssBlock(json, 'securities');
		if (!securities) return [];

		const cols = securities.columns;
		const secidIdx = getColumnIndex(cols, 'secid');
		const shortnameIdx = getColumnIndex(cols, 'shortname');
		const nameIdx = getColumnIndex(cols, 'name');
		const typeIdx = getColumnIndex(cols, 'type');
		const isTradedIdx = getColumnIndex(cols, 'is_traded');

		if (secidIdx === -1 || shortnameIdx === -1) return [];

		const results: AssetSearchItem[] = [];
		for (const row of securities.data) {
			if (results.length >= SEARCH_LIMIT) break;

			const isTraded =
				isTradedIdx >= 0 ? getCellValue(row, isTradedIdx) : 1;
			if (isTraded !== 1) continue;

			const ticker = moexCellToString(getCellValue(row, secidIdx));
			const shortname = moexCellToString(getCellValue(row, shortnameIdx));
			const fullName =
				nameIdx >= 0
					? moexCellToString(getCellValue(row, nameIdx))
					: shortname;
			const moexType =
				typeIdx >= 0
					? moexCellToString(getCellValue(row, typeIdx))
					: 'common_share';

			if (!ticker) continue;

			results.push({
				ticker: ticker.toUpperCase(),
				name: shortname || fullName || ticker,
				type: mapMoexTypeToAssetType(moexType),
			});
		}

		return results;
	}
}
