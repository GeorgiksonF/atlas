<template>
	<div class="flex flex-col gap-6 text-slate-300">
		<header class="flex flex-col gap-1">
			<h1 class="text-xl font-semibold text-slate-100">Портфель</h1>
			<p class="text-sm text-slate-400">
				Счёт:
				<span class="text-slate-200">{{ store.activePortfolio.name }}</span>
			</p>
		</header>

		<PortfolioSummaryMetrics />
	</div>
</template>

<script setup lang="ts">
import PortfolioSummaryMetrics from '@/features/portfolios/components/PortfolioSummaryMetrics.vue';
import { usePortfoliosStore } from '@/features/portfolios/stores/portfoliosStore';

const store = usePortfoliosStore();
</script>
