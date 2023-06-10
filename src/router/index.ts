import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home/:email',
      name: 'home',
      component: () => import('../views/Home.vue')

    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/About.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue')
    },
    {
      path: '/signin',
      name: 'signin',
      component: () => import('../views/Signin.vue')
    }
  ]
})

export default router
