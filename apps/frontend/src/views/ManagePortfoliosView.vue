<template>
	<div class="w-full text-slate-300">
		<h1 class="mb-6 text-xl font-semibold">Управление портфелями</h1>

		<div class="mb-6">
			<IconField icon-position="left" class="w-full max-w-md">
				<InputIcon class="pi pi-search" />
				<InputText
					v-model="searchQuery"
					class="w-full"
					placeholder="Поиск по названию портфеля"
					aria-label="Поиск по названию портфеля"
				/>
			</IconField>
		</div>

		<div class="mb-4 flex flex-col gap-4 rounded-lg border border-slate-600 bg-slate-800 p-4">
			<PortfolioCardRow
				icon="pi pi-th-large"
				title="Все активы"
				subtitle="составной"
			>
				<template #actions>
					<Button
						icon="pi pi-ellipsis-v"
						text
						rounded
						size="small"
						aria-label="Действия"
						@click="openMenu($event, null)"
					/>
				</template>
			</PortfolioCardRow>
		</div>

		<div class="flex flex-col gap-4">
			<ManagementCategorySection
				v-for="cat in categoryList"
				:key="cat"
				v-model="expandedByCategory[cat]"
				:icon="categoryIcons[cat]"
				:title="getPortfolioCategoryLabel(cat)"
				:badge="portfoliosByCategory[cat]?.length ?? 0"
				:sum-label="categorySumLabel()"
			>
				<PortfolioCardRow
					v-for="p in portfoliosByCategory[cat]"
					:key="p.id"
					icon="pi pi-wallet"
					:title="p.name"
					:subtitle="p.broker ?? undefined"
				>
					<template #actions>
						<Button
							icon="pi pi-ellipsis-v"
							text
							rounded
							size="small"
							aria-label="Действия"
							@click="openMenu($event, p)"
						/>
					</template>
				</PortfolioCardRow>
			</ManagementCategorySection>
		</div>

		<Menu ref="menuRef" :model="menuItems" :popup="true" />
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import type { PortfolioCategory, PortfolioResponse } from '@atlas/types';
import { getPortfolioCategoryLabel } from '@/features/portfolios/constants/categories';
import { usePortfoliosStore } from '@/features/portfolios/stores/portfoliosStore';
import ManagementCategorySection from '@/shared/components/ManagementCategorySection.vue';
import PortfolioCardRow from '@/shared/components/PortfolioCardRow.vue';
import { storeToRefs } from 'pinia';

const portfoliosStore = usePortfoliosStore();
const { portfolios } = storeToRefs(portfoliosStore);

const searchQuery = ref('');
const menuRef = ref<{ toggle: (e: Event) => void } | null>(null);
const menuPortfolioContext = ref<PortfolioResponse | null>(null);

const categoryList: PortfolioCategory[] = ['INVESTMENTS', 'CRYPTO'];

const categoryIcons: Record<PortfolioCategory, string> = {
	INVESTMENTS: 'pi pi-briefcase',
	CRYPTO: 'pi pi-bitcoin',
};

const expandedByCategory = ref<Record<PortfolioCategory, boolean>>({
	INVESTMENTS: true,
	CRYPTO: true,
});

const filteredPortfolios = computed(() => {
	const q = searchQuery.value.trim().toLowerCase();
	if (!q) return portfolios.value;
	return portfolios.value.filter((p) => p.name.toLowerCase().includes(q));
});

const portfoliosByCategory = computed(() => {
	const map: Record<PortfolioCategory, PortfolioResponse[]> = {
		INVESTMENTS: [],
		CRYPTO: [],
	};
	for (const p of filteredPortfolios.value) {
		map[p.category].push(p);
	}
	return map;
});

const menuItems = computed(() => [
	{ label: 'Редактировать', icon: 'pi pi-pencil' },
	{ label: 'Удалить', icon: 'pi pi-trash' },
]);

function categorySumLabel(): string {
	// Заглушка: сумма по категории будет позже (пригодится id категории)
	return '—';
}

function openMenu(e: Event, portfolio: PortfolioResponse | null) {
	menuPortfolioContext.value = portfolio;
	menuRef.value?.toggle(e);
}

onMounted(() => {
	portfoliosStore.fetchPortfolios();
});
</script>
