import { ref } from 'vue';

import { defineStore } from 'pinia';

export const usePortfolioUiStore = defineStore('portfolioUi', () => {
	const isPortfolioSidebarOpen = ref(false);

	const openPortfolioSidebar = (): void => {
		isPortfolioSidebarOpen.value = true;
	};

	const closePortfolioSidebar = (): void => {
		isPortfolioSidebarOpen.value = false;
	};

	const togglePortfolioSidebar = (): void => {
		isPortfolioSidebarOpen.value = !isPortfolioSidebarOpen.value;
	};

	return {
		isPortfolioSidebarOpen,
		openPortfolioSidebar,
		closePortfolioSidebar,
		togglePortfolioSidebar,
	};
});
