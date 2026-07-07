import type { TransactionType } from '@atlas/types';

export const isTradeType = (type: TransactionType): boolean =>
	type === 'BUY' || type === 'SELL';

export const isCashType = (type: TransactionType): boolean =>
	type === 'DEPOSIT' || type === 'WITHDRAWAL';
