import { usePortfoliosStore } from '../stores/portfoliosStore';

export function usePortfoliosBootstrap() {
	const store = usePortfoliosStore();

	async function bootstrapPortfolios(): Promise<void> {
		try {
			await Promise.all([store.fetchPortfolios(), store.fetchBrokers()]);
		} catch {
			store.setLoadError('Не удалось загрузить портфели');
		}
	}

	return {
		bootstrapPortfolios,
	};
}
