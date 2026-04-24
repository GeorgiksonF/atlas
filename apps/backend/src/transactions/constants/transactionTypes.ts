/** Список типов сделки для class-validator — совпадает с `TransactionType` из `@atlas/types`. */
export const TRANSACTION_TYPES = [
	'BUY',
	'SELL',
	'DEPOSIT',
	'WITHDRAWAL',
] as const;
