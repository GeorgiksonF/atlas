import type { MenuItem } from 'primevue/menuitem';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
import { usePortfoliosStore } from '@/features/portfolios/stores/portfoliosStore';
import { useAddTransactionModalStore } from '@/features/transactions/stores/addTransactionModalStore';

export function useAppQuickActions(): { quickActions: MenuItem[] } {
	const router = useRouter();
	const addTransactionModalStore = useAddTransactionModalStore();
	const portfoliosStore = usePortfoliosStore();
	const toast = useToast();

	const quickActions: MenuItem[] = [
		{
			label: 'Добавить сделку',
			command: () => addTransactionModalStore.open(),
		},
		{
			label: 'Добавить портфель',
			command: () => {
				if (portfoliosStore.isPortfolioSidebarOpen) {
					portfoliosStore.togglePortfolioSidebar();
				}
				void router.push({ name: 'createPortfolio' });
			},
		},
		{
			label: 'Добавить актив',
			command: () => {
				toast.add({
					severity: 'info',
					summary: 'Скоро',
					detail: 'Добавление актива из этого меню пока в разработке.',
					life: 4000,
				});
			},
		},
	];

	return { quickActions };
}
