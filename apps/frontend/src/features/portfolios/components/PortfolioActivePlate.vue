<template>
	<div
		class="cursor-pointer flex items-center gap-1 rounded-lg border border-slate-600 bg-slate-600/50 transition-colors hover:border-slate-500 hover:bg-slate-600"
	>
		<PortfoliosListItem
			:portfolio="store.activePortfolio"
			actions-pinned
			active
			icon="pi pi-wallet"
			@click="store.togglePortfolioSidebar()"
		/>
	</div>
</template>

<script setup lang="ts">
import { usePortfoliosStore } from '../stores/portfoliosStore';
import { PortfoliosListItem } from '@/entities/portfolios';

const store = usePortfoliosStore();
</script>
