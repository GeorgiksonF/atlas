<template>
	<div class="bg-slate-900 min-h-screen flex flex-row">
		<AppSidebar />

		<div class="flex-1 flex flex-col min-w-0">
			<AppTopPanel />

			<div class="flex-1 relative overflow-hidden">
				<main id="main-content" class="h-full w-full p-4 text-slate-300">
					<router-view />
				</main>
				<PortfolioSidebar />
			</div>
		</div>

		<AppGlobalModals />
	</div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

import { usePortfoliosBootstrap } from '@/features/portfolios/composables/usePortfoliosBootstrap';
import { AppGlobalModals, AppSidebar, AppTopPanel } from '@widgets';
import { PortfolioSidebar } from '@widgets/portfolios';

const { bootstrapPortfolios } = usePortfoliosBootstrap();

onMounted(() => {
	void bootstrapPortfolios();
});
</script>
