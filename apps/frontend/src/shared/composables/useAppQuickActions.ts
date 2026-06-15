import type { MenuItem } from 'primevue/menuitem';
import { useAppToast } from '@utils';
import { useRouter } from 'vue-router';
import { usePortfoliosStore } from '@/features/portfolios/stores/portfoliosStore';
import { useAddTransactionModalStore } from '@/features/transactions/stores/addTransactionModalStore';

export function useAppQuickActions(): { quickActions: MenuItem[] } {
	const router = useRouter();
	const addTransactionModalStore = useAddTransactionModalStore();
	const store = usePortfoliosStore();
	const toast = useAppToast();

	const quickActions: MenuItem[] = [
		{
			label: 'Добавить сделку',
			command: () => addTransactionModalStore.open(),
		},
		{
			label: 'Добавить портфель',
			command: () => {
				if (store.isPortfolioSidebarOpen) {
					store.togglePortfolioSidebar();
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
