import type { PortfolioResponse } from '@atlas/types';
import { usePortfoliosStore } from '@/features/portfolios/stores/portfoliosStore';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';

export type UsePortfolioDeleteConfirmOptions = {
	afterSuccess?: () => void;
};

export function usePortfolioDeleteConfirm(options?: UsePortfolioDeleteConfirmOptions) {
	const confirm = useConfirm();
	const toast = useToast();
	const portfoliosStore = usePortfoliosStore();

	function confirmDeletePortfolio(portfolio: PortfolioResponse | null): void {
		if (!portfolio) return;

		confirm.require({
			header: 'Удаление портфеля',
			message: `Удалить портфель «${portfolio.name}»? Это действие нельзя отменить.`,
			rejectLabel: 'Отмена',
			acceptLabel: 'Удалить',
			rejectClass: 'p-button-secondary',
			acceptClass: 'p-button-danger',
			accept: async () => {
				try {
					await portfoliosStore.deletePortfolio(portfolio.id);
					toast.add({
						severity: 'success',
						summary: 'Портфель удалён',
						life: 3000,
					});
					options?.afterSuccess?.();
				} catch {
					toast.add({
						severity: 'error',
						summary: 'Не удалось удалить портфель',
						life: 5000,
					});
				}
			},
		});
	}

	return { confirmDeletePortfolio };
}
