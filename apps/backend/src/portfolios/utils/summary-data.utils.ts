import type { TransactionResponse } from '@atlas/types';

export const compareTransactionsChronologically = (
	a: TransactionResponse,
	b: TransactionResponse,
): number => {
	const dateDiff = a.date.getTime() - b.date.getTime();
	if (dateDiff !== 0) return dateDiff;
	return a.createdAt.getTime() - b.createdAt.getTime();
};

export const mergeTransactionsChronologically = (
	groups: TransactionResponse[][],
): TransactionResponse[] =>
	[...groups.flat()].sort(compareTransactionsChronologically);

export const collectAssetIds = (
	transactions: TransactionResponse[],
): string[] => [
	...new Set(
		transactions
			.map((tx) => tx.assetId)
			.filter((id): id is string => id !== null),
	),
];
