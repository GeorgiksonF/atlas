<template>
	<div
		class="flex h-20 w-full shrink-0 items-center justify-between border-b border-slate-600 bg-slate-800 px-4"
	>
		<button
			type="button"
			class="account-card flex items-center gap-3 rounded-lg border border-slate-600 bg-slate-600/50 px-4 py-2.5 text-left transition-colors hover:border-slate-500 hover:bg-slate-600"
			@click="portfoliosStore.togglePortfolioSidebar()"
		>
			<i class="pi pi-wallet text-slate-300" />
			<div class="min-w-0">
				<div class="truncate text-sm font-medium text-slate-100">
					{{ accountLabel }}
				</div>
				<div class="text-xs text-slate-400">
					{{ accountCategoryLabel }}
				</div>
			</div>
			<Button
				:icon="
					portfoliosStore.isPortfolioSidebarOpen
						? 'pi pi-chevron-up'
						: 'pi pi-chevron-down'
				"
				text
				rounded
				size="small"
				class="ml-1 shrink-0"
				aria-label="Действия со счётом"
				@click.stop="menuRef?.toggle($event)"
			/>
			<Menu ref="menuRef" :model="accountMenuItems" :popup="true" />
		</button>

		<UserProfile />
	</div>
</template>

<script setup lang="ts">
import { getPortfolioCategoryLabel } from '@/features/portfolios/constants/categories';
import { usePortfoliosStore } from '@/features/portfolios/stores/portfoliosStore';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';

const portfoliosStore = usePortfoliosStore();
const { activePortfolioId } = storeToRefs(portfoliosStore);

const menuRef = ref<{ toggle: (e: Event) => void } | null>(null);

const accountLabel = computed(() => {
	if (activePortfolioId.value === 'all') return 'Все активы';
	const p = portfoliosStore.getActivePortfolio();
	return p?.name ?? 'Портфель';
});

const accountCategoryLabel = computed(() => {
	if (activePortfolioId.value === 'all') return 'составной';
	const p = portfoliosStore.getActivePortfolio();
	if (!p) return '';
	return getPortfolioCategoryLabel(p.category);
});

const accountMenuItems = [
	{ label: 'Редактировать', icon: 'pi pi-pencil' },
	{ label: 'Удалить', icon: 'pi pi-trash' },
];
</script>

<style scoped>
.account-card {
  cursor: pointer;
}
</style>
