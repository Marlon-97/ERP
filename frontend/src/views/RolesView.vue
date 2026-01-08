<template>
  <AppLayout>
    <div class="px-4 sm:px-6 lg:px-8">
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-2xl font-semibold text-gray-900">Roles & Permissions</h1>
          <p class="mt-2 text-sm text-gray-700">
            Manage system roles and their permissions. Create custom roles with specific access levels.
          </p>
        </div>
        <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            v-if="authStore.hasPermission('roles:create')"
            @click="openCreateModal"
            type="button"
            class="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            <ShieldPlusIcon class="h-5 w-5 mr-2" />
            Add Role
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
        <p class="text-gray-500">Loading roles...</p>
      </div>

      <!-- Roles Grid -->
      <div v-else class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="role in roles"
          :key="role.id"
          class="bg-white overflow-hidden shadow rounded-lg"
        >
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium text-gray-900">{{ role.name }}</h3>
              <ShieldCheckIcon class="h-8 w-8 text-indigo-600" />
            </div>
            <p class="mt-2 text-sm text-gray-500">{{ role.description }}</p>
            <div class="mt-4">
              <p class="text-sm font-medium text-gray-700">Permissions:</p>
              <div class="mt-2 flex flex-wrap gap-2">
                <span
                  v-for="permission in role.permissions.slice(0, 5)"
                  :key="permission"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                >
                  {{ permission }}
                </span>
                <span
                  v-if="role.permissions.length > 5"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                >
                  +{{ role.permissions.length - 5 }} more
                </span>
              </div>
            </div>
          </div>
          <div v-if="authStore.hasAnyPermission(['roles:update', 'roles:delete']) && !['admin', 'user'].includes(role.name)" class="bg-gray-50 px-4 py-4 sm:px-6 flex justify-end space-x-3">
            <button
              v-if="authStore.hasPermission('roles:update')"
              @click="openEditModal(role)"
              class="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              Edit
            </button>
            <button
              v-if="authStore.hasPermission('roles:delete')"
              @click="deleteRole(role.id)"
              class="text-sm font-medium text-red-600 hover:text-red-500"
            >
              Delete
            </button>
          </div>
          <div v-else class="bg-gray-50 px-4 py-4 sm:px-6">
            <p class="text-xs text-gray-500">System role - Cannot be modified</p>
          </div>
        </div>
      </div>

      <!-- Role Modal (Create/Edit) -->
      <div v-if="showModal" class="fixed z-10 inset-0 overflow-y-auto">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeModal"></div>
          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
            <form @submit.prevent="saveRole">
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                  {{ editingRole ? 'Edit Role' : 'Create New Role' }}
                </h3>
                <div class="space-y-4">
                  <div>
                    <label for="name" class="block text-sm font-medium text-gray-700">Role Name</label>
                    <input
                      v-model="formData.name"
                      type="text"
                      id="name"
                      required
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                    />
                  </div>
                  <div>
                    <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      v-model="formData.description"
                      id="description"
                      rows="2"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                    ></textarea>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
                    <div class="max-h-64 overflow-y-auto border border-gray-300 rounded-md p-4 space-y-2">
                      <div v-for="permission in availablePermissions" :key="permission" class="flex items-center">
                        <input
                          :id="permission"
                          v-model="formData.permissions"
                          :value="permission"
                          type="checkbox"
                          class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label :for="permission" class="ml-3 text-sm text-gray-700">
                          {{ permission }}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="submit"
                  class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {{ editingRole ? 'Update' : 'Create' }}
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
import { ShieldCheckIcon } from '@heroicons/vue/24/outline';
import { ShieldCheckIcon as ShieldPlusIcon } from '@heroicons/vue/24/solid';
import api from '../api';

const authStore = useAuthStore();
const roles = ref([]);
const availablePermissions = ref([]);
const loading = ref(true);
const showModal = ref(false);
const editingRole = ref(null);
const message = ref('');
const messageType = ref('success');

const formData = ref({
  name: '',
  description: '',
  permissions: [],
});

const loadRoles = async () => {
  try {
    roles.value = await api.getRoles();
  } catch (error) {
    showMessage('Failed to load roles: ' + error.message, 'error');
  } finally {
    loading.value = false;
  }
};

const loadPermissions = async () => {
  try {
    availablePermissions.value = await api.getPermissions();
  } catch (error) {
    console.error('Failed to load permissions:', error);
  }
};

const openCreateModal = () => {
  editingRole.value = null;
  formData.value = { name: '', description: '', permissions: [] };
  showModal.value = true;
};

const openEditModal = (role) => {
  editingRole.value = role;
  formData.value = {
    name: role.name,
    description: role.description,
    permissions: [...role.permissions],
  };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  editingRole.value = null;
  formData.value = { name: '', description: '', permissions: [] };
};

const saveRole = async () => {
  try {
    if (editingRole.value) {
      await api.updateRole(editingRole.value.id, formData.value);
      showMessage('Role updated successfully', 'success');
    } else {
      await api.createRole(formData.value);
      showMessage('Role created successfully', 'success');
    }
    closeModal();
    await loadRoles();
  } catch (error) {
    showMessage('Failed to save role: ' + error.message, 'error');
  }
};

const deleteRole = async (id) => {
  if (!confirm('Are you sure you want to delete this role?')) return;
  
  try {
    await api.deleteRole(id);
    showMessage('Role deleted successfully', 'success');
    await loadRoles();
  } catch (error) {
    showMessage('Failed to delete role: ' + error.message, 'error');
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
  loadRoles();
  loadPermissions();
});
</script>
