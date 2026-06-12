import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { MenuItem } from 'primevue/menuitem';
import { PortfolioContext } from '../stores/portfoliosStore';

const router = useRouter();

export const usePortfolioMenuItems = (
	portfoio: PortfolioContext,
	onDelete: (portfoio: PortfolioContext) => void,
) => {
	const items = ref<MenuItem[]>([
		{
			label: 'Редактировать',
			icon: 'pi pi-pencil',
			disabled: portfoio.isSystem,
			command: () => {
				router.push({ name: 'editPortfolio', params: { id: portfoio.id } });
			},
		},
		{
			label: 'Удалить',
			icon: 'pi pi-trash',
			disabled: portfoio.isSystem,
			command: () => onDelete(portfoio),
		},
	]);

	return items.value.filter((item) => !item.isSystem);
};
