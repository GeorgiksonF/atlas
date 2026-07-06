import type { MoexIssResponse, MoexIssTable } from './moex-iss.types';

export function parseIssBlock(
	json: MoexIssResponse,
	blockName: string,
): MoexIssTable | null {
	const block = json[blockName];
	if (!block?.columns?.length || !block.data?.length) {
		return null;
	}

	return block;
}

export function getColumnIndex(columns: string[], columnName: string): number {
	return columns.indexOf(columnName);
}

export function getCellValue(row: unknown[], columnIndex: number): unknown {
	if (columnIndex < 0) return undefined;
	return row[columnIndex];
}

export function getFirstRow(table: MoexIssTable): unknown[] | null {
	return table.data[0] ?? null;
}
