import { Injectable } from '@nestjs/common';

import type { AssetSearchItem } from '@atlas/types';

import { mapMoexTypeToAssetType } from '../integrations/moex/moex-asset-type.mapper';
import { moexCellToString } from '../integrations/moex/moex-cell.utils';
import { MoexHttpClient } from '../integrations/moex/moex-http.client';
import {
	getCellValue,
	getColumnIndex,
	parseIssBlock,
} from '../integrations/moex/moex-iss.parser';
import type { MoexIssResponse } from '../integrations/moex/moex-iss.types';

const SEARCH_LIMIT = 20;

@Injectable()
export class MoexSearchService {
	private readonly client = new MoexHttpClient();

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
