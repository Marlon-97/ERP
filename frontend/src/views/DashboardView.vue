<template>
  <AppLayout>
    <div class="px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p class="mt-2 text-sm text-gray-700">
            Welcome to your ERP system dashboard. Overview of your system modules and quick stats.
          </p>
        </div>
      </div>

      <!-- Stats -->
      <div class="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <UsersIcon class="h-6 w-6 text-gray-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                  <dd class="flex items-baseline">
                    <div class="text-2xl font-semibold text-gray-900">{{ stats.users }}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-5 py-3">
            <div class="text-sm">
              <router-link
                v-if="authStore.hasPermission('users:read')"
                to="/users"
                class="font-medium text-indigo-600 hover:text-indigo-500"
              >
                View all
              </router-link>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <ShieldCheckIcon class="h-6 w-6 text-gray-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Total Roles</dt>
                  <dd class="flex items-baseline">
                    <div class="text-2xl font-semibold text-gray-900">{{ stats.roles }}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-5 py-3">
            <div class="text-sm">
              <router-link
                v-if="authStore.hasPermission('roles:read')"
                to="/roles"
                class="font-medium text-indigo-600 hover:text-indigo-500"
              >
                View all
              </router-link>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <CubeIcon class="h-6 w-6 text-gray-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Active Modules</dt>
                  <dd class="flex items-baseline">
                    <div class="text-2xl font-semibold text-gray-900">3</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-5 py-3">
            <div class="text-sm">
              <span class="font-medium text-gray-500">Users, Roles, Dashboard</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="mt-8">
        <h2 class="text-lg font-medium text-gray-900">Quick Actions</h2>
        <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <router-link
            v-if="authStore.hasPermission('users:create')"
            to="/users"
            class="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
          >
            <div class="flex-shrink-0">
              <UserPlusIcon class="h-6 w-6 text-indigo-600" />
            </div>
            <div class="flex-1 min-w-0">
              <span class="absolute inset-0" aria-hidden="true" />
              <p class="text-sm font-medium text-gray-900">Create New User</p>
              <p class="text-sm text-gray-500">Add a new user to the system</p>
            </div>
          </router-link>

          <router-link
            v-if="authStore.hasPermission('roles:create')"
            to="/roles"
            class="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
          >
            <div class="flex-shrink-0">
              <ShieldPlusIcon class="h-6 w-6 text-indigo-600" />
            </div>
            <div class="flex-1 min-w-0">
              <span class="absolute inset-0" aria-hidden="true" />
              <p class="text-sm font-medium text-gray-900">Create New Role</p>
              <p class="text-sm text-gray-500">Define a new role with permissions</p>
            </div>
          </router-link>
        </div>
      </div>

      <!-- System Info -->
      <div class="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">System Information</h3>
          <p class="mt-1 max-w-2xl text-sm text-gray-500">Current user and system details</p>
        </div>
        <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div class="sm:col-span-1">
              <dt class="text-sm font-medium text-gray-500">Username</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ authStore.user?.username }}</dd>
            </div>
            <div class="sm:col-span-1">
              <dt class="text-sm font-medium text-gray-500">Role</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ authStore.user?.role }}</dd>
            </div>
            <div class="sm:col-span-1">
              <dt class="text-sm font-medium text-gray-500">Email</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ authStore.user?.email }}</dd>
            </div>
            <div class="sm:col-span-1">
              <dt class="text-sm font-medium text-gray-500">Permissions</dt>
              <dd class="mt-1 text-sm text-gray-900">
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
