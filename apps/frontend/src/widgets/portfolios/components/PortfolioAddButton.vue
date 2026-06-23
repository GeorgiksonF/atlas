<template>
	<router-link
		:to="to"
		class="add-portfolio-button mt-3 flex items-center justify-center gap-2 rounded-lg border border-dashed border-slate-600 py-2.5 text-sm text-slate-400 transition-colors hover:border-slate-500 hover:bg-slate-700 hover:text-slate-300"
		@click="store.togglePortfolioSidebar()"
	>
		<i class="pi pi-plus" />
		<span>Добавить портфель</span>
	</router-link>
</template>

<script setup lang="ts">
import { usePortfoliosStore } from '@/features/portfolios/stores/portfoliosStore';

import type { RouteLocationRaw } from 'vue-router';

const store = usePortfoliosStore();

withDefaults(
	defineProps<{
		to?: RouteLocationRaw;
	}>(),
	{
		to: () => ({ name: 'createPortfolio' }),
	},
);
</script>
