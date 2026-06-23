import type {
	CreateTransaction,
	TransactionResponse,
	TransactionsResponse,
} from '@atlas/types';

import { apiClient } from '@/shared/api/client';

export const transactionsRepository = {
	async getList(portfolioId: string): Promise<TransactionsResponse> {
		const { data } = await apiClient.get<TransactionsResponse>(
			`/portfolios/${portfolioId}/transactions`,
		);
		return data;
	},

	async getById(
		portfolioId: string,
		transactionId: string,
	): Promise<TransactionResponse> {
		const { data } = await apiClient.get<TransactionResponse>(
			`/portfolios/${portfolioId}/transactions/${transactionId}`,
		);
		return data;
	},

	async create(
		portfolioId: string,
		body: CreateTransaction,
	): Promise<TransactionResponse> {
		const { data } = await apiClient.post<TransactionResponse>(
			`/portfolios/${portfolioId}/transactions`,
			body,
		);
		return data;
	},
};
