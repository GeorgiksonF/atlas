import { Prisma } from '@atlas/database';

import type {
	PortfolioWithTransactionsResponse,
	TransactionResponse,
} from '@atlas/types';

type PortfolioWithTransactionsRow = Prisma.PortfolioGetPayload<{
	include: {
		transactions: true;
	};
}>;

export const portfolioToResponse = (
	row: PortfolioWithTransactionsRow,
): PortfolioWithTransactionsResponse => ({
	id: row.id,
	name: row.name,
	category: row.category,
	broker: row.broker,
	createdAt: row.createdAt,
	updatedAt: row.updatedAt,
	description: row.description,
	userId: row.userId,
	transactions: row.transactions.map(
		(tx): TransactionResponse => ({
			id: tx.id,
			quantity: tx.quantity,
			price: Number(tx.price),
			type: tx.type,
			date: tx.date,
			currency: tx.currency,
			createdAt: tx.createdAt,
			portfolioId: tx.portfolioId,
			assetId: tx.assetId,
		}),
	),
});
