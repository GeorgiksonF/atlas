<template>
	<div class="bg-slate-900 min-h-screen flex flex-row">
		<AppSidebar :quick-actions="quickActions" />

		<div class="flex-1 flex flex-col min-w-0">
			<AppTopPanel />

			<div class="flex-1 relative overflow-hidden">
				<main id="main-content" class="h-full w-full p-4 text-slate-300">
					<router-view />
				</main>
				<PortfolioSidebar v-if="isPortfolioSidebarOpen" />
			</div>
		</div>

		<AppGlobalModals />
	</div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useAppQuickActions } from '@/shared/composables/useAppQuickActions';
import { getErrorMessage } from '@/shared/api/errorMessage';
import AppGlobalModals from '@/shared/layout/AppGlobalModals.vue';
import AppSidebar from '@/shared/layout/AppSidebar.vue';
import AppTopPanel from '@/shared/layout/AppTopPanel.vue';
import PortfolioSidebar from '@/shared/layout/PortfolioSidebar.vue';
import { usePortfoliosStore } from '@/features/portfolios/stores/portfoliosStore';

const { quickActions } = useAppQuickActions();
const portfoliosStore = usePortfoliosStore();
const { isPortfolioSidebarOpen } = storeToRefs(portfoliosStore);
const toast = useToast();

onMounted(async () => {
	try {
		await portfoliosStore.fetchPortfolios();
	} catch (err: unknown) {
		toast.add({
			severity: 'error',
			summary: 'Не удалось загрузить портфели',
			detail: getErrorMessage(err, 'Проверьте соединение и попробуйте снова.'),
			life: 5000,
		});
	}
});
</script>
