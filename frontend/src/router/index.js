import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: { requiresAuth: false, layout: 'blank' },
  },
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../views/DashboardView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/users',
    name: 'Users',
    component: () => import('../views/UsersView.vue'),
    meta: { 
      requiresAuth: true,
      permission: 'users:read'
    },
  },
  {
    path: '/roles',
    name: 'Roles',
    component: () => import('../views/RolesView.vue'),
    meta: { 
      requiresAuth: true,
      permission: 'roles:read'
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login' });
  } else if (to.name === 'Login' && authStore.isAuthenticated) {
    next({ name: 'Dashboard' });
  } else if (to.meta.permission && !authStore.hasPermission(to.meta.permission)) {
    // Redirect to dashboard if user doesn't have permission
    next({ name: 'Dashboard' });
  } else {
    next();
  }
});

export default router;
