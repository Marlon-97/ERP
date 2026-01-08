<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    <!-- Animated background -->
    <div class="absolute inset-0 bg-gradient-to-br from-primary-500 via-secondary-500 to-primary-700 opacity-90"></div>
    <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAgNHYyaDJ2LTJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
    
    <div class="relative max-w-md w-full space-y-8 animate-scale-in">
      <!-- Card Container -->
      <div class="bg-white rounded-2xl shadow-2xl overflow-hidden">
        <!-- Header Section -->
        <div class="bg-gradient-to-r from-primary-600 to-secondary-600 px-8 py-10 text-center">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 shadow-lg">
            <svg class="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h2 class="text-3xl font-extrabold text-white mb-2">
            ERP System
          </h2>
          <p class="text-primary-100 text-sm">
            Sign in to access your workspace
          </p>
        </div>

        <!-- Form Section -->
        <div class="px-8 py-8">
          <form class="space-y-6" @submit.prevent="handleLogin">
            <!-- Error Message -->
            <div v-if="error" class="rounded-lg bg-red-50 p-4 border border-red-200 animate-slide-in">
              <div class="flex">
                <div class="flex-shrink-0">
                  <ExclamationTriangleIcon class="h-5 w-5 text-red-400" />
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-red-800">{{ error }}</p>
                </div>
              </div>
            </div>

            <!-- Username Input -->
            <div>
              <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  id="username"
                  v-model="credentials.username"
                  name="username"
                  type="text"
                  required
                  class="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 text-sm"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            <!-- Password Input -->
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon class="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  v-model="credentials.password"
                  name="password"
                  type="password"
                  required
                  class="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 text-sm"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <!-- Submit Button -->
            <div>
              <button
                type="submit"
                :disabled="loading"
                class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
                {{ loading ? 'Signing in...' : 'Sign in' }}
              </button>
            </div>

            <!-- Default Credentials -->
            <div class="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-4 border border-primary-200">
              <p class="text-sm font-medium text-gray-700 mb-2">Default credentials:</p>
              <div class="space-y-1">
                <p class="text-xs text-gray-600">
                  <span class="font-semibold">Username:</span>
                  <code class="ml-2 px-2 py-0.5 bg-white rounded text-primary-600">admin</code>
                </p>
                <p class="text-xs text-gray-600">
                  <span class="font-semibold">Password:</span>
                  <code class="ml-2 px-2 py-0.5 bg-white rounded text-primary-600">Admin123!</code>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>

      <!-- Footer -->
      <div class="text-center">
        <p class="text-white text-sm drop-shadow">
          © 2024 ERP System. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { LockClosedIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/solid';

const router = useRouter();
const authStore = useAuthStore();

const credentials = ref({
  username: '',
  password: '',
});

const loading = ref(false);
const error = ref('');

const handleLogin = async () => {
  loading.value = true;
  error.value = '';

  try {
    await authStore.login(credentials.value);
    router.push({ name: 'Dashboard' });
  } catch (err) {
    error.value = err.message || 'Invalid credentials. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>
