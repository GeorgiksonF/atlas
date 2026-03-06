import { createRouter, createWebHistory } from 'vue-router';
import LandingView from '../views/LandingView.vue';
import LoginView from '../views/LoginView.vue';
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: LandingView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/app',
      name: 'app',
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
          component: () => import('../views/ManagePortfoliosView.vue'),
        },
      ],
    },
  ],
});

export default router;

