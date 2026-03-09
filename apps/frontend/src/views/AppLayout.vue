<template>
	<div class="bg-slate-900 min-h-screen flex flex-row">
		<AppSidebar />

		<div class="flex-1 flex flex-col min-w-0">
			<AppTopPanel />

			<div class="flex-1 relative overflow-hidden">
				<main class="h-full w-full p-4 text-slate-300">
					<router-view />
				</main>
				<PortfolioSidebar v-if="isPortfolioSidebarOpen" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
import AppSidebar from '@/shared/layout/AppSidebar.vue';
import AppTopPanel from '@/shared/layout/AppTopPanel.vue';
import PortfolioSidebar from '@/shared/layout/PortfolioSidebar.vue';
import { usePortfoliosStore } from '@/features/portfolios/stores/portfoliosStore';

const portfoliosStore = usePortfoliosStore();
const { isPortfolioSidebarOpen } = storeToRefs(portfoliosStore);

onMounted(() => {
	portfoliosStore.fetchPortfolios();
});
</script>
