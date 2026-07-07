import { MaybeRefOrGetter, ref, toValue, watch } from 'vue';
import { useRouter } from 'vue-router';

import { getErrorMessage } from '@/shared/api/errorMessage';
import type { PortfolioContext } from '@entities/portfolios';
import { useAppToast } from '@utils';

import { portfoliosRepository } from '../api/portfoliosRepository';
import { portfolioFormToUpdate, portfolioResponseToContext } from '../constants/adapters';
import type { PortfolioForm } from '../schemas/portfolioFormSchemas';
import { usePortfolioForm } from './usePortofolioForm';

export function useEditPortfolioForm(portfolioId: MaybeRefOrGetter<string>) {
	const router = useRouter();
	const toast = useAppToast();
	const portfolio = ref<PortfolioContext | null>(null);
	const isPortfolioFetching = ref(false);

	const loadPortfolio = async () => {
		isPortfolioFetching.value = true;
		try {
			const response = await portfoliosRepository.getById(toValue(portfolioId));
			portfolio.value = portfolioResponseToContext(response);
		} catch (err) {
			toast.error(getErrorMessage(err, 'Не удалось найти портфель'));
		} finally {
			isPortfolioFetching.value = false;
		}
	};

	const form = usePortfolioForm({
		portfolio,
		submit: (values: PortfolioForm) =>
			portfoliosRepository.update(
				toValue(portfolioId),
				portfolioFormToUpdate(values),
			),
		onSuccess: async () => {
			await router.push({ name: 'portfolioManagement' });
		},
		successMessage: 'Портфель сохранён',
	});

	watch(() => toValue(portfolioId), loadPortfolio, { immediate: true });

	return {
		...form,
		isPortfolioFetching,
		portfolio,
	};
}
