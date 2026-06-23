<template>
	<div
		class="w-full lg:w-[380px] lg:min-h-[160px] lg:max-w-[380px] hover:cursor-pointer p-4 bg-slate-700 group-hover:bg-slate-600 rounded-lg group border border-slate-600 transition-colors hover:border-slate-500 hover:bg-slate-600"
		@click="goToEdit"
	>
		<div class="flex justify-between gap-2">
			<div class="flex items-center gap-2">
				<i :class="icon" class="shrink-0 text-slate-400" />
				<div>
					<div class="truncate text-sm font-medium text-slate-100">
						{{ portfolio.name }}
					</div>
					<div v-if="portfolio.category" class="truncate text-xs text-slate-400">
						{{ getPortfolioCategoryLabel(portfolio.category) }}
					</div>
				</div>
			</div>
			<Button
				v-if="menuItems.length"
				icon="pi pi-ellipsis-v"
				text
				rounded
				size="small"
				aria-label="Действия"
				@click.stop="openMenu"
			/>
		</div>
		<Menu ref="menuRef" :model="menuItems" :popup="true" />
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { type PortfolioContext } from '../stores/portfoliosStore.ts';
import { usePortfolioMenuItems } from '../composables/usePortfoliosMenuItems.ts';
import { usePortfolioDeleteConfirm } from '../composables/usePortfolioDeleteConfirm.ts';
import { getPortfolioCategoryLabel } from '../utils/helper.ts';

const props = defineProps<{
	icon: string;
	portfolio: PortfolioContext;
}>();

const { confirmDeletePortfolio } = usePortfolioDeleteConfirm();
const router = useRouter();
const menuRef = ref();

const openMenu = (e: Event) => {
	menuRef.value?.toggle(e);
};

const menuItems = usePortfolioMenuItems(props.portfolio, confirmDeletePortfolio);

const goToEdit = () => router.push({ name: 'editPortfolio', params: { id: props.portfolio.id } });
</script>
