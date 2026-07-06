import { moexCellToNumber } from './moex-cell.utils';
import { getCellValue, getColumnIndex, getFirstRow } from './moex-iss.parser';
import type { MoexIssTable } from './moex-iss.types';

export function extractQuoteFromMarketdata(
	table: MoexIssTable,
): { price: number } | null {
	const lastIdx = getColumnIndex(table.columns, 'LAST');
	const row = getFirstRow(table);
	if (!row) return null;

	const price = moexCellToNumber(getCellValue(row, lastIdx));
	if (price === null || price <= 0) return null;

	return { price };
}
