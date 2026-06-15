import { Prisma } from '@atlas/database';
import type { AssetWithQuoteResponse } from '@atlas/types';

type AssetWithQuoteRow = Prisma.AssetGetPayload<{ include: { quote: true } }>;

export const assetWithQuotesToResponse = (
	row: AssetWithQuoteRow,
): AssetWithQuoteResponse => {
	return {
		...row,
		quote: row.quote
			? {
					price: Number(row.quote.price),
					currency: row.quote.currency,
				}
			: undefined,
	};
};
