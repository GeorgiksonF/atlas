import { getErrorMessage } from '@/shared/api/errorMessage';
import { useAppToast } from '@utils';

import { usePortfoliosStore } from '../stores/portfoliosStore';

export function usePortfoliosBootstrap() {
	const store = usePortfoliosStore();
	const toast = useAppToast();

	async function bootstrapPortfolios(): Promise<void> {
		const [portfoliosResult, brokersResult] = await Promise.allSettled([
			store.fetchPortfolios(),
			store.fetchBrokers(),
		]);

		if (portfoliosResult.status === 'rejected') {
			toast.error(
				getErrorMessage(portfoliosResult.reason, 'Не удалось загрузить портфели'),
			);
		}

		if (brokersResult.status === 'rejected') {
			toast.error(
				getErrorMessage(brokersResult.reason, 'Не удалось загрузить список брокеров'),
			);
		}
	}

	return {
		bootstrapPortfolios,
	};
}
