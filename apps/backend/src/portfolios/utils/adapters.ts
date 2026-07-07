import { Portfolio, Prisma } from '@atlas/database';
import type {
	PortfolioBroker,
	PortfolioResponse,
	PortfolioWithTransactionsResponse,
} from '@atlas/types';

import { transactionToResponse } from '../../transactions/utils/adapters';

type PortfolioWithTransactionsRow = Prisma.PortfolioGetPayload<{
	include: {
		transactions: true;
	};
}>;

export const portfolioWithTransactionToResponse = (
	row: PortfolioWithTransactionsRow,
): PortfolioWithTransactionsResponse => ({
	id: row.id,
	name: row.name,
	category: row.category,
	broker: row.broker as PortfolioBroker | null,
	createdAt: row.createdAt,
	updatedAt: row.updatedAt,
	description: row.description,
	userId: row.userId,
	transactions: row.transactions.map(transactionToResponse),
});

export const portfolioToResponse = (row: Portfolio): PortfolioResponse => ({
	id: row.id,
	name: row.name,
	category: row.category,
	broker: row.broker as PortfolioBroker | null,
	createdAt: row.createdAt,
	updatedAt: row.updatedAt,
	description: row.description,
	userId: row.userId,
});
