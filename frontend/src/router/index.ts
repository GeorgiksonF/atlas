import { createRouter, createWebHistory } from 'vue-router';
import LandingView from '../views/landing/LandingView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: LandingView
    },
    {
      path: '/app',
      name: 'app',
      component: () => import('../views/app/AppMainView.vue')
    },
  ],
});

export default router;

