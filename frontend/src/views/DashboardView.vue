<template>
  <AppLayout>
    <div class="px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="sm:flex sm:items-center animate-slide-in">
        <div class="sm:flex-auto">
          <h1 class="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p class="mt-2 text-sm text-gray-600">
            Welcome to your ERP system dashboard. Overview of your system modules and quick stats.
          </p>
        </div>
      </div>

      <!-- Stats -->
      <div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div class="bg-white overflow-hidden shadow-lg rounded-2xl border border-gray-100 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 animate-scale-in">
          <div class="p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-md">
                  <UsersIcon class="h-8 w-8 text-white" />
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                  <dd class="flex items-baseline">
                    <div class="text-3xl font-bold text-gray-900">{{ stats.users }}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div class="bg-gradient-to-r from-primary-50 to-primary-100 px-6 py-3">
            <div class="text-sm">
              <router-link
                v-if="authStore.hasPermission('users:read')"
                to="/users"
                class="font-semibold text-primary-700 hover:text-primary-800 flex items-center justify-between group"
              >
                View all
                <svg class="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </router-link>
              <span v-else class="text-gray-500">View restricted</span>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow-lg rounded-2xl border border-gray-100 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 animate-scale-in" style="animation-delay: 0.1s">
          <div class="p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-14 h-14 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl flex items-center justify-center shadow-md">
                  <ShieldCheckIcon class="h-8 w-8 text-white" />
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Total Roles</dt>
                  <dd class="flex items-baseline">
                    <div class="text-3xl font-bold text-gray-900">{{ stats.roles }}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div class="bg-gradient-to-r from-secondary-50 to-secondary-100 px-6 py-3">
            <div class="text-sm">
              <router-link
                v-if="authStore.hasPermission('roles:read')"
                to="/roles"
                class="font-semibold text-secondary-700 hover:text-secondary-800 flex items-center justify-between group"
              >
                View all
                <svg class="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </router-link>
              <span v-else class="text-gray-500">View restricted</span>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow-lg rounded-2xl border border-gray-100 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 animate-scale-in" style="animation-delay: 0.2s">
          <div class="p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-14 h-14 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center shadow-md">
                  <CubeIcon class="h-8 w-8 text-white" />
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Active Modules</dt>
                  <dd class="flex items-baseline">
                    <div class="text-3xl font-bold text-gray-900">3</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div class="bg-gradient-to-r from-accent-50 to-accent-100 px-6 py-3">
            <div class="text-sm">
              <span class="font-medium text-accent-700">Users, Roles, Dashboard</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="mt-10 animate-fade-in">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <router-link
            v-if="authStore.hasPermission('users:create')"
            to="/users"
            class="relative group rounded-2xl border-2 border-gray-200 bg-white px-8 py-6 shadow-md hover:shadow-xl hover:border-primary-300 flex items-center space-x-4 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transform hover:-translate-y-1 transition-all duration-300"
          >
            <div class="flex-shrink-0">
              <div class="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                <UserPlusIcon class="h-7 w-7 text-white" />
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <span class="absolute inset-0" aria-hidden="true" />
              <p class="text-lg font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">Create New User</p>
              <p class="text-sm text-gray-500">Add a new user to the system</p>
            </div>
            <svg class="w-6 h-6 text-gray-400 group-hover:text-primary-600 transform group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </router-link>

          <router-link
            v-if="authStore.hasPermission('roles:create')"
            to="/roles"
            class="relative group rounded-2xl border-2 border-gray-200 bg-white px-8 py-6 shadow-md hover:shadow-xl hover:border-secondary-300 flex items-center space-x-4 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 transform hover:-translate-y-1 transition-all duration-300"
          >
            <div class="flex-shrink-0">
              <div class="w-14 h-14 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                <ShieldPlusIcon class="h-7 w-7 text-white" />
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <span class="absolute inset-0" aria-hidden="true" />
              <p class="text-lg font-semibold text-gray-900 group-hover:text-secondary-700 transition-colors">Create New Role</p>
              <p class="text-sm text-gray-500">Define a new role with permissions</p>
            </div>
            <svg class="w-6 h-6 text-gray-400 group-hover:text-secondary-600 transform group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </router-link>
        </div>
      </div>

      <!-- System Info -->
      <div class="mt-10 bg-white shadow-lg overflow-hidden sm:rounded-2xl border border-gray-100 animate-fade-in">
        <div class="px-6 py-6 bg-gradient-to-r from-primary-50 to-secondary-50 border-b border-gray-200">
          <h3 class="text-xl font-bold text-gray-900">System Information</h3>
          <p class="mt-1 text-sm text-gray-600">Current user and system details</p>
        </div>
        <div class="px-6 py-6">
          <dl class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div class="border-l-4 border-primary-500 pl-4 py-2 bg-primary-50 rounded-r-lg">
              <dt class="text-sm font-medium text-gray-600">Username</dt>
              <dd class="mt-1 text-lg font-semibold text-gray-900">{{ authStore.user?.username }}</dd>
            </div>
            <div class="border-l-4 border-secondary-500 pl-4 py-2 bg-secondary-50 rounded-r-lg">
              <dt class="text-sm font-medium text-gray-600">Role</dt>
              <dd class="mt-1 text-lg font-semibold text-gray-900 capitalize">{{ authStore.user?.role }}</dd>
            </div>
            <div class="border-l-4 border-accent-500 pl-4 py-2 bg-accent-50 rounded-r-lg">
              <dt class="text-sm font-medium text-gray-600">Email</dt>
              <dd class="mt-1 text-lg font-semibold text-gray-900">{{ authStore.user?.email }}</dd>
            </div>
            <div class="border-l-4 border-primary-500 pl-4 py-2 bg-primary-50 rounded-r-lg">
              <dt class="text-sm font-medium text-gray-600">Permissions</dt>
              <dd class="mt-1 text-lg font-semibold text-gray-900">
                {{ authStore.isAdmin ? 'All Permissions (Admin)' : authStore.user?.permissions?.length || 0 }}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import AppLayout from '../components/layout/AppLayout.vue';
import {
  UsersIcon,
  ShieldCheckIcon,
  CubeIcon,
  UserPlusIcon,
} from '@heroicons/vue/24/outline';
import { ShieldCheckIcon as ShieldPlusIcon } from '@heroicons/vue/24/solid';
import api from '../api';

const authStore = useAuthStore();
const stats = ref({
  users: 0,
  roles: 0,
});

onMounted(async () => {
  try {
    if (authStore.hasPermission('users:read')) {
      const users = await api.getUsers();
      stats.value.users = users.length;
    }
    if (authStore.hasPermission('roles:read')) {
      const roles = await api.getRoles();
      stats.value.roles = roles.length;
    }
  } catch (error) {
    console.error('Error loading stats:', error);
  }
});
</script>
