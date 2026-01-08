import { defineStore } from 'pinia';
import api from '../api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
  }),

  getters: {
    isAdmin: (state) => state.user?.role === 'admin',
    hasPermission: (state) => (permission) => {
      if (!state.user) return false;
      if (state.user.role === 'admin') return true;
      return state.user.permissions?.includes(permission) || false;
    },
    hasAnyPermission: (state) => (permissions) => {
      if (!state.user) return false;
      if (state.user.role === 'admin') return true;
      return permissions.some(p => state.user.permissions?.includes(p));
    },
    hasAllPermissions: (state) => (permissions) => {
      if (!state.user) return false;
      if (state.user.role === 'admin') return true;
      return permissions.every(p => state.user.permissions?.includes(p));
    },
  },

  actions: {
    async login(credentials) {
      try {
        const response = await api.login(credentials);
        this.token = response.token;
        this.user = response.user;
        this.isAuthenticated = true;
        localStorage.setItem('token', response.token);
        return response;
      } catch (error) {
        this.logout();
        throw error;
      }
    },

    async logout() {
      try {
        await api.logout();
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        this.token = null;
        this.user = null;
        this.isAuthenticated = false;
        localStorage.removeItem('token');
      }
    },

    async checkAuth() {
      if (!this.token) {
        this.isAuthenticated = false;
        return false;
      }
      // In production, verify token validity with backend
      return this.isAuthenticated;
    },
  },
});
