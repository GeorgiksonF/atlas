<template>
  <div class="text-slate-300">
    <p class="text-sm text-slate-400">
      Счёт: {{ store.activePortfolio.name }}
    </p>
    <p class="mt-2">Аналитика</p>
  </div>
</template>

<script setup lang="ts">
import { usePortfoliosStore } from '@/features/portfolios/stores/portfoliosStore';

const store = usePortfoliosStore();
</script>
