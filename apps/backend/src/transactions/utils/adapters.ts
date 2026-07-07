import type { Transaction } from '@atlas/database';
import type { TransactionResponse } from '@atlas/types';

export const transactionToResponse = (
	row: Transaction,
): TransactionResponse => ({
	...row,
	price: Number(row.price),
});
