import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/main',
    },
    {
      path: '/main',
      name: 'main',
      component: () => import('../views/HomeView.vue'),
      meta: {
        title: 'Main',
        header: 'Main',
        requiresAuth: true
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Login.vue'),
      meta: {
        title: 'Login',
        header: 'Login',
        requiresAuth: false
      }
    },
  ],
})

/** 全域路由守衛 */
router.beforeEach((to, from, next) => {
  // 獲取 token 或其他身份驗證狀態
  const isAuthenticated = localStorage.getItem('token')

  // 如果路由需要驗證
  if (to.meta.requiresAuth) {
    // 檢查是否已驗證
    if (!isAuthenticated) {
      next({ name: 'Login', query: { redirect: to.fullPath } })
    } else {
      next()
    }
  } else {
    // 如果已登入且試圖訪問登入頁，重導向到主頁
    if (to.name === 'Login' && isAuthenticated) {
      next({ path: '/main' })
    } else {
      next()
    }
  }
})

export default router
