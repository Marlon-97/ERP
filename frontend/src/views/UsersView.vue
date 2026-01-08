<template>
  <AppLayout>
    <div class="px-4 sm:px-6 lg:px-8">
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-2xl font-semibold text-gray-900">Users</h1>
          <p class="mt-2 text-sm text-gray-700">
            A list of all users in the system including their username, email, and role.
          </p>
        </div>
        <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            v-if="authStore.hasPermission('users:create')"
            @click="openCreateModal"
            type="button"
            class="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            <UserPlusIcon class="h-5 w-5 mr-2" />
            Add User
          </button>
        </div>
      </div>

      <!-- Error/Success Messages -->
      <div v-if="message" class="mt-4">
        <div :class="messageType === 'error' ? 'bg-red-50 border-red-400' : 'bg-green-50 border-green-400'" class="rounded-md border p-4">
          <p :class="messageType === 'error' ? 'text-red-800' : 'text-green-800'" class="text-sm">{{ message }}</p>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="mt-8 text-center">
        <p class="text-gray-500">Loading users...</p>
      </div>

      <!-- Users Table -->
      <div v-else class="mt-8 flex flex-col">
        <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table class="min-w-full divide-y divide-gray-300">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Username
                    </th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Email
                    </th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Role
                    </th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Created At
                    </th>
                    <th v-if="authStore.hasAnyPermission(['users:update', 'users:delete'])" scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span class="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white">
                  <tr v-for="user in users" :key="user.id">
                    <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                      {{ user.username }}
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ user.email }}</td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <span class="inline-flex rounded-full px-2 text-xs font-semibold leading-5"
                        :class="user.role === 'admin' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'">
                        {{ user.role }}
                      </span>
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {{ new Date(user.createdAt).toLocaleDateString() }}
                    </td>
                    <td v-if="authStore.hasAnyPermission(['users:update', 'users:delete'])" class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <button
                        v-if="authStore.hasPermission('users:update')"
                        @click="openEditModal(user)"
                        class="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        v-if="authStore.hasPermission('users:delete')"
                        @click="deleteUser(user.id)"
                        class="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- User Modal (Create/Edit) -->
      <div v-if="showModal" class="fixed z-10 inset-0 overflow-y-auto">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeModal"></div>
          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <form @submit.prevent="saveUser">
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                  {{ editingUser ? 'Edit User' : 'Create New User' }}
                </h3>
                <div class="space-y-4">
                  <div>
                    <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
                    <input
                      v-model="formData.username"
                      type="text"
                      id="username"
                      required
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                    />
                  </div>
                  <div>
                    <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      v-model="formData.email"
                      type="email"
                      id="email"
                      required
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                    />
                  </div>
                  <div>
                    <label for="role" class="block text-sm font-medium text-gray-700">Role</label>
                    <select
                      v-model="formData.role"
                      id="role"
                      required
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                    >
                      <option v-for="role in roles" :key="role.id" :value="role.name">
                        {{ role.name }}
                      </option>
                    </select>
                  </div>
                  <div v-if="!editingUser">
                    <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                    <input
                      v-model="formData.password"
                      type="password"
                      id="password"
                      :required="!editingUser"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                    />
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="submit"
                  class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {{ editingUser ? 'Update' : 'Create' }}
                </button>
                <button
                  type="button"
                  @click="closeModal"
                  class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import AppLayout from '../components/layout/AppLayout.vue';
import { UserPlusIcon } from '@heroicons/vue/24/outline';
import api from '../api';

const authStore = useAuthStore();
const users = ref([]);
const roles = ref([]);
const loading = ref(true);
const showModal = ref(false);
const editingUser = ref(null);
const message = ref('');
const messageType = ref('success');

const formData = ref({
  username: '',
  email: '',
  role: '',
  password: '',
});

const loadUsers = async () => {
  try {
    users.value = await api.getUsers();
  } catch (error) {
    showMessage('Failed to load users: ' + error.message, 'error');
  } finally {
    loading.value = false;
  }
};

const loadRoles = async () => {
  try {
    roles.value = await api.getRoles();
  } catch (error) {
    console.error('Failed to load roles:', error);
  }
};

const openCreateModal = () => {
  editingUser.value = null;
  formData.value = { username: '', email: '', role: '', password: '' };
  showModal.value = true;
};

const openEditModal = (user) => {
  editingUser.value = user;
  formData.value = {
    username: user.username,
    email: user.email,
    role: user.role,
    password: '',
  };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  editingUser.value = null;
  formData.value = { username: '', email: '', role: '', password: '' };
};

const saveUser = async () => {
  try {
    if (editingUser.value) {
      await api.updateUser(editingUser.value.id, formData.value);
      showMessage('User updated successfully', 'success');
    } else {
      await api.createUser(formData.value);
      showMessage('User created successfully', 'success');
    }
    closeModal();
    await loadUsers();
  } catch (error) {
    showMessage('Failed to save user: ' + error.message, 'error');
  }
};

const deleteUser = async (id) => {
  if (!confirm('Are you sure you want to delete this user?')) return;
  
  try {
    await api.deleteUser(id);
    showMessage('User deleted successfully', 'success');
    await loadUsers();
  } catch (error) {
    showMessage('Failed to delete user: ' + error.message, 'error');
  }
};

const showMessage = (msg, type = 'success') => {
  message.value = msg;
  messageType.value = type;
  setTimeout(() => {
    message.value = '';
  }, 5000);
};

onMounted(() => {
  loadUsers();
  loadRoles();
});
</script>
