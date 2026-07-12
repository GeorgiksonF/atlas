export function moexCellToString(value: unknown): string {
	if (value === null || value === undefined) return '';
	if (typeof value === 'string') return value.trim();
	if (typeof value === 'number' || typeof value === 'boolean') {
		return String(value).trim();
	}
	return '';
}

export function moexCellToNumber(value: unknown): number | null {
	if (value === null || value === undefined) return null;
	const parsed = typeof value === 'number' ? value : Number(value);
	if (Number.isNaN(parsed)) return null;
	return parsed;
}
