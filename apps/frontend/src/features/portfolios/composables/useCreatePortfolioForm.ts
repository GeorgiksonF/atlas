import { useRouter } from 'vue-router';

import { portfoliosRepository } from '../api/portfoliosRepository';
import { portfolioFormToCreate } from '../constants/adapters';
import type { PortfolioForm } from '../schemas/portfolioFormSchemas';
import { usePortfolioForm } from './usePortofolioForm';

export function useCreatePortfolioForm() {
	const router = useRouter();

	return usePortfolioForm({
		submit: (form: PortfolioForm) =>
			portfoliosRepository.create(portfolioFormToCreate(form)),
		onSuccess: async () => {
			await router.push({ name: 'portfolio' });
		},
		successMessage: 'Портфель создан',
	});
}
