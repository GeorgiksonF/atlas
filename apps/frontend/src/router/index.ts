import { createRouter, createWebHistory } from 'vue-router';

import { usePortfoliosStore } from '@/features/portfolios/stores/portfoliosStore.ts';

import LandingView from '../views/LandingView.vue';
import LoginView from '../views/LoginView.vue';

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: '/',
			name: 'landing',
			component: LandingView,
		},
		{
			path: '/login',
			name: 'login',
			component: LoginView,
		},
		{
			path: '/app',
			name: 'app',
			async beforeEnter() {
				const store = usePortfoliosStore();
				try {
					await store.fetchPortfolios();
					await store.fetchBrokers();
				} catch {
					store.setLoadError('Не удалось загрузить портфели');
				}
			},
			component: () => import('../views/AppLayout.vue'),
			redirect: { name: 'portfolio' },
			children: [
				{
					path: 'portfolio',
					name: 'portfolio',
					component: () => import('../views/PortfolioView.vue'),
				},
				{
					path: 'analytics',
					name: 'analytics',
					component: () => import('../views/AnalyticsView.vue'),
				},
				{
					path: 'portfolio/new',
					name: 'createPortfolio',
					component: () => import('../views/CreatePortfolioView.vue'),
				},
				{
					path: 'management',
					name: 'portfolioManagement',
					component: () => import('../views/PortfoliosManagerView.vue'),
				},
				{
					path: 'management/:id/edit',
					name: 'editPortfolio',
					component: () => import('../views/EditPortfolioView.vue'),
				},
			],
		},
	],
});

export default router;
