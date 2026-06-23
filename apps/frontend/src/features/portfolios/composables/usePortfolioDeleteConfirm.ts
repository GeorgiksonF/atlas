import { PortfolioContext, usePortfoliosStore } from '@/features/portfolios/stores/portfoliosStore';
import { useAppToast } from '@utils';

import { useConfirm } from 'primevue/useconfirm';

export type UsePortfolioDeleteConfirmOptions = {
	afterSuccess?: () => void;
};

export const usePortfolioDeleteConfirm = (options?: UsePortfolioDeleteConfirmOptions) => {
	const confirm = useConfirm();
	const toast = useAppToast();
	const store = usePortfoliosStore();

	function confirmDeletePortfolio(portfolio: PortfolioContext): void {
		confirm.require({
			header: 'Удаление портфеля',
			message: `Удалить портфель «${portfolio.name}»? Это действие нельзя отменить.`,
			rejectLabel: 'Отмена',
			acceptLabel: 'Удалить',
			rejectClass: 'p-button-secondary',
			acceptClass: 'p-button-danger',
			accept: async () => {
				try {
					await store.deletePortfolio(portfolio.id);
					toast.success('Портфель удалён');
					options?.afterSuccess?.();
				} catch {
					toast.error('Не удалось удалить портфель');
				}
			},
		});
	}

	return { confirmDeletePortfolio };
};
