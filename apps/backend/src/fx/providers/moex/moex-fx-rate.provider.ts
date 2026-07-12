import { Injectable } from '@nestjs/common';

import {
	MOEX_FX_BOARD,
	MOEX_FX_ENGINE,
	MOEX_FX_MARKET,
	MOEX_FX_USD_TICKER,
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
import type { IFxRateProvider } from '../../contract/fx-rate-provider.interface';

const extractLastPrice = (table: MoexIssTable): number | null => {
	const lastIdx = getColumnIndex(table.columns, 'LAST');
	const row = getFirstRow(table);
	if (!row) return null;

	const price = moexCellToNumber(getCellValue(row, lastIdx));
	if (price === null || price <= 0) return null;
	return price;
};

@Injectable()
export class MoexFxRateProvider implements IFxRateProvider {
	constructor(private readonly client: MoexHttpClient) {}

	async getUsdToRub(): Promise<number | null> {
		const path = `/engines/${MOEX_FX_ENGINE}/markets/${MOEX_FX_MARKET}/boards/${MOEX_FX_BOARD}/securities/${MOEX_FX_USD_TICKER}.json`;
		const json = await this.client.fetchJson<MoexIssResponse>(path);
		if (!json) return null;

		const marketdata = parseIssBlock(json, 'marketdata');
		if (!marketdata) return null;

		return extractLastPrice(marketdata);
	}
}
