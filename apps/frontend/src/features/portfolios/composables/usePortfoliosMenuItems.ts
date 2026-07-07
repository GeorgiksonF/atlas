import { ref } from 'vue';
import { useRouter } from 'vue-router';

import type { PortfolioContext } from '@entities/portfolios';

import { MenuItem } from 'primevue/menuitem';

export const usePortfolioMenuItems = (onDelete: (portfolio: PortfolioContext) => void) => {
	const router = useRouter();

	const getPortfolioMenuItems = (portfolio: PortfolioContext): MenuItem[] => {
		const items = ref<MenuItem[]>([
			{
				label: 'Редактировать',
				icon: 'pi pi-pencil',
				disabled: portfolio.isSystem,
				command: () => {
					router.push({ name: 'editPortfolio', params: { id: portfolio.id } });
				},
			},
			{
				label: 'Удалить',
				icon: 'pi pi-trash',
				disabled: portfolio.isSystem,
				command: () => onDelete(portfolio),
			},
		]);

		return items.value.filter((item) => !item.isSystem && !item.disabled);
	};

	return { getPortfolioMenuItems };
};
