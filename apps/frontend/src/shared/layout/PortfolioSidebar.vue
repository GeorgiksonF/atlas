<template>
	<aside
		class="absolute left-0 top-0 bottom-0 z-10 flex w-90 flex-col border-r border-slate-600 bg-slate-900"
	>
		<div class="flex flex-col gap-1 overflow-y-auto p-3">
			<PortfolioCard
				icon="pi pi-th-large"
				title="Все активы"
				subtitle="составной"
				value="—"
				:active="activePortfolioId === 'all'"
				@click="portfoliosStore.setActivePortfolio('all')"
			/>

			<CollapsibleSection
				v-model="isInvestmentsExpanded"
				icon="pi pi-briefcase"
				title="Инвестиции"
				:badge="portfolios.length"
			>
				<div v-for="p in portfolios" :key="p.id" class="relative rounded-lg">
					<PortfolioCard
						icon="pi pi-wallet"
						:title="p.name"
						:subtitle="getPortfolioCategoryLabel(p.category)"
						:value="'1 000 000 000 ₽'"
						:active="activePortfolioId === p.id"
						@click="portfoliosStore.setActivePortfolio(p.id)"
					>
						<template #actions>
							<Button
								icon="pi pi-ellipsis-v"
								text
								rounded
								size="small"
								class="min-w-0!"
								aria-label="Действия"
								@click.stop="openPortfolioMenu($event, p)"
							/>
						</template>
					</PortfolioCard>
				</div>
			</CollapsibleSection>

			<AddPortfolioButton />
		</div>

		<Menu ref="portfolioMenuRef" :model="portfolioMenuItems" :popup="true" />
	</aside>
</template>

<script setup lang="ts">
import type { PortfolioResponse } from '@atlas/types';
import { getPortfolioCategoryLabel } from '@/features/portfolios/constants/categories';
import { usePortfoliosStore } from '@/features/portfolios/stores/portfoliosStore';
import AddPortfolioButton from '@/shared/layout/AddPortfolioButton.vue';
import CollapsibleSection from '@/shared/layout/CollapsibleSection.vue';
import PortfolioCard from '@/shared/layout/PortfolioCard.vue';
import { storeToRefs } from 'pinia';
import { ref, computed } from 'vue';

const portfoliosStore = usePortfoliosStore();
const { portfolios, activePortfolioId } = storeToRefs(portfoliosStore);

const isInvestmentsExpanded = ref(true);
const portfolioMenuRef = ref<{ toggle: (e: Event) => void } | null>(null);
const menuPortfolioContext = ref<PortfolioResponse | null>(null);

const portfolioMenuItems = computed(() => [
	{ label: 'Редактировать', icon: 'pi pi-pencil' },
	{ label: 'Удалить', icon: 'pi pi-trash' },
]);

function openPortfolioMenu(e: Event, portfolio: PortfolioResponse) {
	menuPortfolioContext.value = portfolio;
	portfolioMenuRef.value?.toggle(e);
}
</script>
