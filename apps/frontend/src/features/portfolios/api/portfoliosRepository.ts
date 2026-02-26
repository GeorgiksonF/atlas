import { apiClient } from '@/shared/api/client';
import type {
	CreatePortfolio,
	PortfolioResponse,
	PortfoliosResponse,
	UpdatePortfolio,
} from '@atlas/types';

export const portfoliosRepository = {
	async getList(): Promise<PortfoliosResponse> {
		const { data } = await apiClient.get<PortfoliosResponse>('/portfolios');
		return data;
	},

	async create(body: CreatePortfolio): Promise<PortfolioResponse> {
		const { data } = await apiClient.post<PortfolioResponse>('/portfolios', body);
		return data;
	},

	async update(id: string, body: UpdatePortfolio): Promise<PortfolioResponse> {
		const { data } = await apiClient.patch<PortfolioResponse>(
			`/portfolios/${id}`,
			body,
		);
		return data;
	},

	async delete(id: string): Promise<void> {
		await apiClient.delete(`/portfolios/${id}`);
	},
};
