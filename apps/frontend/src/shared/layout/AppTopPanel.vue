<template>
	<div
		class="flex h-20 w-full shrink-0 items-center justify-between border-b border-slate-600 bg-slate-800 px-4"
	>
		<div
			class="account-card flex items-center gap-1 rounded-lg border border-slate-600 bg-slate-600/50 transition-colors hover:border-slate-500 hover:bg-slate-600"
		>
			<button
				type="button"
				class="portfolio-sidebar-trigger flex min-w-0 flex-1 items-center gap-3 px-4 py-2.5 text-left"
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
			</button>
			<div
				v-if="activePortfolioId !== 'all'"
				class="flex shrink-0 items-center pr-2"
			>
				<Button
					icon="pi pi-ellipsis-v"
					text
					rounded
					size="small"
					aria-label="Действия со счётом"
					@click="menuRef?.toggle($event)"
				/>
				<Menu ref="menuRef" :model="accountMenuItems" :popup="true" />
			</div>
		</div>

		<UserProfile />
	</div>
</template>

<script setup lang="ts">
import { usePortfolioDeleteConfirm } from '@/features/portfolios/composables/usePortfolioDeleteConfirm';
import { getPortfolioCategoryLabel } from '@/features/portfolios/constants/categories';
import { usePortfoliosStore } from '@/features/portfolios/stores/portfoliosStore';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const portfoliosStore = usePortfoliosStore();
const { activePortfolioId } = storeToRefs(portfoliosStore);
const { confirmDeletePortfolio } = usePortfolioDeleteConfirm();

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

const accountMenuItems = computed(() => {
	const portfolio = portfoliosStore.getActivePortfolio() ?? null;

	return [
		{
			label: 'Редактировать',
			icon: 'pi pi-pencil',
			disabled: !portfolio,
			command: () => {
				if (portfolio) {
					router.push({ name: 'editPortfolio', params: { id: portfolio.id } });
				}
			},
		},
		{
			label: 'Удалить',
			icon: 'pi pi-trash',
			disabled: !portfolio,
			command: () => confirmDeletePortfolio(portfolio),
		},
	];
});
</script>

<style scoped>
.account-card {
  cursor: pointer;
}
</style>
