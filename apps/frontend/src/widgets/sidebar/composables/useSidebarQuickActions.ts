import { useRouter } from 'vue-router';

import { usePortfolioUiStore } from '@/features/portfolios/stores/portfolioUiStore';
import { useAddTransactionModalStore } from '@/features/transactions/stores/addTransactionModalStore';
import { useAppToast } from '@utils';

import type { MenuItem } from 'primevue/menuitem';

export function useSidebarQuickActions(): { quickActions: MenuItem[] } {
	const router = useRouter();
	const addTransactionModalStore = useAddTransactionModalStore();
	const portfolioUiStore = usePortfolioUiStore();
	const toast = useAppToast();

	const quickActions: MenuItem[] = [
		{
			label: 'Добавить сделку',
			command: () => addTransactionModalStore.open(),
		},
		{
			label: 'Добавить портфель',
			command: () => {
				if (portfolioUiStore.isPortfolioSidebarOpen) {
					portfolioUiStore.closePortfolioSidebar();
				}
				void router.push({ name: 'createPortfolio' });
			},
		},
		{
			label: 'Добавить актив',
			command: () => {
				toast.info('Скоро', {
					detail: 'Добавление актива из этого меню пока в разработке.',
					life: 4000,
				});
			},
		},
	];

	return { quickActions };
}
