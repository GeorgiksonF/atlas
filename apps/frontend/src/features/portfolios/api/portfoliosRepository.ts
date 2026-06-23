import type {
	BrokerResponse,
	CreatePortfolio,
	PortfolioResponse,
	PortfoliosResponse,
	PortfolioSummaryResponse,
	UpdatePortfolio,
} from '@atlas/types';

import { apiClient } from '@/shared/api/client';

export const portfoliosRepository = {
	async getList(): Promise<PortfoliosResponse> {
		const { data } = await apiClient.get<PortfoliosResponse>('/portfolios');
		return data;
	},

	async getBrokers(): Promise<BrokerResponse[]> {
		const { data } = await apiClient.get<BrokerResponse[]>('/portfolios/brokers');
		return data;
	},

	async getById(id: string): Promise<PortfolioResponse> {
		const { data } = await apiClient.get<PortfolioResponse>(`/portfolios/${id}`);
		return data;
	},

	async getSummary(portfolioId: string | 'all'): Promise<PortfolioSummaryResponse> {
		const url =
			portfolioId === 'all'
				? '/portfolios/summary/all'
				: `/portfolios/${portfolioId}/summary`;
		const { data } = await apiClient.get<PortfolioSummaryResponse>(url);
		return data;
	},

	async create(body: CreatePortfolio): Promise<PortfolioResponse> {
		const { data } = await apiClient.post<PortfolioResponse>('/portfolios', body);
		return data;
	},

	async update(id: string, body: UpdatePortfolio): Promise<PortfolioResponse> {
		const { data } = await apiClient.patch<PortfolioResponse>(`/portfolios/${id}`, body);
		return data;
	},

	async delete(id: string): Promise<void> {
		await apiClient.delete(`/portfolios/${id}`);
	},
};
