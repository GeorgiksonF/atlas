import type {
	AssetResponse,
	AssetSearchItem,
	AssetsResponse,
	AssetWithQuoteResponse,
} from '@atlas/types';

import { apiClient } from '@/shared/api/client';

export const assetsRepository = {
	async getList(): Promise<AssetsResponse> {
		const { data } = await apiClient.get<AssetsResponse>('/assets');
		return data;
	},

	async getById(id: string): Promise<AssetResponse> {
		const { data } = await apiClient.get<AssetResponse>(`/assets/${id}`);
		return data;
	},

	async search(query: string): Promise<AssetSearchItem[]> {
		if (!query?.trim()) return [];
		const { data } = await apiClient.get<AssetSearchItem[]>(
			'/assets/import/search',
			{ params: { q: query.trim() } },
		);
		return data ?? [];
	},

	async ensureFromExchange(ticker: string): Promise<AssetWithQuoteResponse> {
		const { data } = await apiClient.post<AssetWithQuoteResponse>(
			'/assets/import/from-exchange',
			{ ticker: ticker.trim() },
		);
		return data;
	},
};
