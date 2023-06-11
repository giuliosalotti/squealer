import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Login',
      component: () => import('../views/Login.vue'),
    },
    {
      path: '/home',
      name: 'Home',
      component: () => import('../views/Home.vue')

    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/About.vue')
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Login.vue')
    },
    {
      path: '/signin',
      name: 'Signin',
      component: () => import('../views/Signin.vue')
    }
  ]
})

export default router
