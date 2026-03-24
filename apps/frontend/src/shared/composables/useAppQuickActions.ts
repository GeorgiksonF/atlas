import type { MenuItem } from 'primevue/menuitem';
import { useToast } from 'primevue/usetoast';
import { useAddTransactionModalStore } from '@/features/transactions/stores/addTransactionModalStore';

export function useAppQuickActions(): { quickActions: MenuItem[] } {
	const addTransactionModalStore = useAddTransactionModalStore();
	const toast = useToast();

	const quickActions: MenuItem[] = [
		{
			label: 'Добавить сделку',
			command: () => addTransactionModalStore.open(),
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
