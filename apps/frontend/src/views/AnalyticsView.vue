<template>
  <div class="text-slate-300">
    <p class="text-sm text-slate-400">
      Счёт: {{ activeLabel }}
    </p>
    <p class="mt-2">Аналитика</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { usePortfoliosStore } from '@/features/portfolios/stores/portfoliosStore';

const portfoliosStore = usePortfoliosStore();
const { activePortfolioId } = storeToRefs(portfoliosStore);

const activeLabel = computed(() => {
	if (activePortfolioId.value === 'all') return 'Все активы';
	const p = portfoliosStore.getActivePortfolio();
	return p?.name ?? '—';
});
</script>
