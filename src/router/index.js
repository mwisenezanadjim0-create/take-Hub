import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '../stores/auth'

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView
    },
    {
        path: '/meetings',
        name: 'meetings',
        component: () => import('../views/MeetingHub.vue')
    },
    {
        path: '/academy',
        name: 'academy',
        component: () => import('../views/AcademyView.vue')
    },
    {
        path: '/business',
        name: 'business',
        component: () => import('../views/BusinessHub.vue')
    },
    {
        path: '/about',
        name: 'about',
        component: () => import('../views/AboutView.vue')
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/LoginView.vue')
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('../views/DashboardView.vue'),
        meta: { requiresAuth: true, isAdmin: true }
    },
    {
        path: '/payment',
        name: 'payment',
        component: () => import('../views/PaymentView.vue'),
        meta: { requiresAuth: true }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next('/login')
    } else if (to.meta.isAdmin && !authStore.isAdmin && !authStore.isPremium && to.path === '/dashboard') {
        next('/')
    } else {
        next()
    }
})

export default router
