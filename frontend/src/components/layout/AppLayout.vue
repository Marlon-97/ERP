<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold text-gray-900">ERP System</h1>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-700">
              {{ authStore.user?.username }} ({{ authStore.user?.role }})
            </span>
            <button
              @click="handleLogout"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <ArrowRightOnRectangleIcon class="h-5 w-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Navigation -->
    <nav class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex space-x-8">
          <router-link
            to="/"
            class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
            active-class="border-indigo-500 text-gray-900"
          >
            <HomeIcon class="inline-block h-5 w-5 mr-1" />
            Dashboard
          </router-link>
          <router-link
            v-if="authStore.hasPermission('users:read')"
            to="/users"
            class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
            active-class="border-indigo-500 text-gray-900"
          >
            <UsersIcon class="inline-block h-5 w-5 mr-1" />
            Users
          </router-link>
          <router-link
            v-if="authStore.hasPermission('roles:read')"
            to="/roles"
            class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
            active-class="border-indigo-500 text-gray-900"
          >
            <ShieldCheckIcon class="inline-block h-5 w-5 mr-1" />
            Roles
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main>
      <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <slot />
      </div>
    </main>
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
