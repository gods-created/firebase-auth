import { createRouter, createWebHistory } from 'vue-router'
import BaseView from '@/pages/Base.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: BaseView,
      name: 'base',
      props: true
    }
  ],
  scrollBehavior() {
    return { top: 0 }
  }
})

router.beforeEach((to, from, next) => {
  const allowedRoutes = ['base'];
  if(!allowedRoutes.includes(to.name)) {
    localStorage.clear();
    return next({name: 'base'})
  }

  return next();
})

export default router
