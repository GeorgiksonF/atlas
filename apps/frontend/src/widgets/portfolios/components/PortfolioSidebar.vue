<template>
	<Transition name="portfolio-sidebar-fade">
		<aside
			v-if="store.isPortfolioSidebarOpen"
			ref="asideRoot"
			class="absolute left-0 top-0 bottom-0 z-10 flex w-90 flex-col border-r border-slate-600 bg-slate-900"
		>
			<div class="flex flex-col gap-1 overflow-y-auto p-3">
				<PortfoliosListItem
					icon="pi pi-th-large"
					:portfolio="ALL_PORTFOLIOS_CONTEXT"
					:active="store.activePortfolio.id === ALL_PORTFOLIOS_CONTEXT.id"
					@click="selectPortfolio(ALL_PORTFOLIOS_CONTEXT.id)"
				/>

				<CollapsibleSection
					v-model="isInvestmentsExpanded"
					icon="pi pi-briefcase"
					title="Инвестиции"
					:badge="store.portfolios.length"
				>
					<PortfoliosListItem
						v-for="p in store.portfolios"
						:key="p.id"
						class="relative rounded-lg"
						icon="pi pi-wallet"
						:portfolio="p"
						:active="store.activePortfolio.id === p.id"
						@click="selectPortfolio(p.id)"
					/>
				</CollapsibleSection>

				<PortfolioAddButton />
			</div>
		</aside>
	</Transition>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import { CollapsibleSection } from '@components';
import { PortfoliosListItem } from '@entities/portfolios';
import { ALL_PORTFOLIOS_CONTEXT,usePortfoliosStore } from '@features/portfolios';

import { onClickOutside } from '@vueuse/core';

import PortfolioAddButton from './PortfolioAddButton.vue';




const store = usePortfoliosStore();

const isInvestmentsExpanded = ref(true);
const asideRoot = ref<HTMLElement | null>(null);

onClickOutside(asideRoot, () => store.togglePortfolioSidebar(), {
	ignore: ['.portfolio-sidebar-trigger', '[data-pc-name="menu"]'],
});

const selectPortfolio = (id: string) => {
	store.setActivePortfolio(id);
	store.togglePortfolioSidebar();
};
</script>

<style scoped>
.portfolio-sidebar-fade-enter-active,
.portfolio-sidebar-fade-leave-active {
	transition: opacity 0.18s ease;
}

.portfolio-sidebar-fade-enter-from,
.portfolio-sidebar-fade-leave-to {
	opacity: 0;
}
</style>
