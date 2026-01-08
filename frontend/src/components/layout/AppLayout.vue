<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-3">
            <div class="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg shadow-md">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h1 class="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              ERP System
            </h1>
          </div>
          <div class="flex items-center space-x-4">
            <div class="hidden sm:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg border border-primary-200">
              <div class="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {{ authStore.user?.username?.charAt(0).toUpperCase() }}
              </div>
              <div class="text-left">
                <p class="text-sm font-semibold text-gray-900">{{ authStore.user?.username }}</p>
                <p class="text-xs text-gray-500 capitalize">{{ authStore.user?.role }}</p>
              </div>
            </div>
            <button
              @click="handleLogout"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <ArrowRightOnRectangleIcon class="h-5 w-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Navigation -->
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex space-x-2">
          <router-link
            to="/"
            class="group relative flex items-center px-4 py-4 text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors duration-200"
            active-class="text-primary-600"
          >
            <HomeIcon class="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
            Dashboard
            <span class="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"></span>
          </router-link>
          <router-link
            v-if="authStore.hasPermission('users:read')"
            to="/users"
            class="group relative flex items-center px-4 py-4 text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors duration-200"
            active-class="text-primary-600"
          >
            <UsersIcon class="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
            Users
            <span class="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"></span>
          </router-link>
          <router-link
            v-if="authStore.hasPermission('roles:read')"
            to="/roles"
            class="group relative flex items-center px-4 py-4 text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors duration-200"
            active-class="text-primary-600"
          >
            <ShieldCheckIcon class="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
            Roles
            <span class="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"></span>
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="animate-fade-in">
      <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <slot />
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 mt-auto">
      <div class="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <p class="text-center text-sm text-gray-500">
          © 2024 ERP System. All rights reserved.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import {
  ArrowRightOnRectangleIcon,
  HomeIcon,
  UsersIcon,
  ShieldCheckIcon,
} from '@heroicons/vue/24/outline';

const router = useRouter();
const authStore = useAuthStore();

const handleLogout = async () => {
  await authStore.logout();
  router.push({ name: 'Login' });
};
</script>
